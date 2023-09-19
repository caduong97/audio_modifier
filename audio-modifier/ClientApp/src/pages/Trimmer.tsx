import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import Waveform from "../components/waveform/Waveform";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, preprocessAudio, trimAudio } from "../store/trimSlice";
import TrimAudioRequest from "../models/trim/TrimAudioRequest";
import { v4 as uuidv4 } from 'uuid';
import UploadedList from "../components/uploads/UploadedList";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { Button } from "reactstrap";
import SettingItem from "../components/SettingItem";
import SettingsDropdown from "../components/SettingsDropdown";

export default function Trimmer() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.trim.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.trim.audioMetadatas)

  const [trimAudioRequest, setTrimAudioRequest] = useState<TrimAudioRequest>({
    jobId: uuidv4(),
    leadingSilence: 0,
    start: 0,
    end: 0,
    trailingSilence: 0,
    outputFileName: ""
  })

  const getUrl = useMemo(
    () => { return audioFiles.length > 0 ? URL.createObjectURL(audioFiles[0]) : "" },
    [audioFiles]
  )

  const isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  };
  // Assigning backend based on touch support on the device
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  const dispatchPreprocessAudioFiles = (formData: FormData) => {
    // TODO: make it so that multiple files can be added to the queue, but only the selected one will be processed, see all marked with #190923
    // Once that's done, the following 3 lines can be removed
    if (audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared())
    }
    dispatch(preprocessAudio(formData))
  }

  const handleClearQueue = () => {
    setAudioFiles([])
    dispatch(audioMetadatasCleared())
  }

  const dispatchUpdateAudioList = () => {
    dispatch(audioMetadatasUpdated(audioMetadatas))
  }

  const dispatchAudioRemove = (fileName: string) => {
    dispatch(audioMetadataRemoved(fileName))
  }

  useEffect(() => {
    if (audioMetadatas.length === 0) {
      setTrimAudioRequest({
        ...trimAudioRequest, 
        leadingSilence: 0,
        start: 0, 
        end: 0, 
        trailingSilence: 0,
        outputFileName: ""
      })
    }
  }, [audioMetadatas])

  useEffect(() => {
    if (audioFiles.length === 0 && audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared())
    }
  }, [audioFiles])

  const trim = useCallback((start: number, end: number) => {
    
    const trimRequest = {...trimAudioRequest, start: start, end: end}
    setTrimAudioRequest(trimRequest)

    const formData = new FormData()
    formData.append('files', audioFiles[0])

    console.log("all files", formData.getAll("files"))
    dispatch(trimAudio({ form: formData, params: trimRequest}))

  }, [trimAudioRequest, audioFiles])

  const handleSaveAsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTrimAudioRequest({...trimAudioRequest, outputFileName: e.target.value})
  }

  const handleLeadingSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTrimAudioRequest({...trimAudioRequest, leadingSilence: parseFloat(e.target.value)})
  }

  const handleTrailingSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTrimAudioRequest({...trimAudioRequest, trailingSilence: parseFloat(e.target.value)})
  }
  

  return (
    <div>
      <h1>Trimmer</h1>

      <UploadForm 
        multiple={false}
        audioFiles={audioFiles} 
        setAudioFiles={setAudioFiles} 
        submit={dispatchPreprocessAudioFiles}
        submitStatus={preprocessStatus}
      />

      {
        audioMetadatas.length > 0 &&
        <>
          <div className="mt-5 mb-2 w-100 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">File queue</h5>
            <Button 
              size="sm" 
              onClick={handleClearQueue}
            >Clear queue</Button>
          </div>

          
          <DndProvider backend={backendForDND}>
            <UploadedList
              audioMetadatas={audioMetadatas}
              updateList={dispatchUpdateAudioList}
              removeListItem={dispatchAudioRemove}

            />
          </DndProvider> 
          <div className='d-flex flex-column flex-sm-row justify-content-end my-3'>
            <SettingsDropdown
              toggleButtonText="Output settings"
              title="Advanced"
              width="400px"
            >
              <div>
                <SettingItem
                  name="Leading silence:"
                  type="number"
                  min={0}
                  max={null}
                  unit="s"
                  placeholder={0}
                  value={trimAudioRequest.leadingSilence}
                  onValueChange={handleLeadingSilenceChange}
                  display="flex"
                ></SettingItem>
                <SettingItem
                  name="Trailing silence:"
                  type="number"
                  min={0}
                  max={null}
                  unit="s"
                  placeholder={0}
                  value={trimAudioRequest.trailingSilence}
                  onValueChange={handleTrailingSilenceChange}
                  display="flex"
                ></SettingItem>
                <SettingItem
                  name="Save as:"
                  type="text"
                  placeholder="Filename..."
                  value={trimAudioRequest.outputFileName}
                  onValueChange={handleSaveAsChange}
                  display="block"
                ></SettingItem>
              </div>
            </SettingsDropdown>
          </div>

          {
            getUrl !== "" &&
            <Waveform 
              url={getUrl}
              trimMode
              trim={trim}
            ></Waveform>
          }       
        </>
      }

     
    </div>
  )
}