import { useCallback, useEffect, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, preprocessAudio, stereoToMono } from "../store/channelSlice";
import { DndProvider } from "react-dnd";
import UploadedList from "../components/uploads/UploadedList";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "reactstrap";
import { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";
import StereoToMonoRequest from "../models/channel/StereoToMonoRequest";
import { v4 as uuidv4 } from 'uuid';

export default function SteoreoToMono() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.channel.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.channel.audioMetadatas)

  const [stereoToMonoRequest, setStereoToMonoRequest] = useState<StereoToMonoRequest>({
    jobId: uuidv4(),
    outputFileName: ""
  })

  const isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  };

  // Assigning backend based on touch support on the device
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  const dispatchPreprocessAudioFiles = (formData: FormData) => {
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
    audioMetadatas.forEach((audioMetadata) => {
      if ((audioMetadata as AudioMetadataWav).channels === 1 || (audioMetadata as AudioMetadataMp3).channelMode === "mono") {
        alert(`${audioMetadata.fileName} is already mono. Aborting...`)
        dispatch(audioMetadataRemoved(audioMetadata.fileName))
      }
    })
  }, [audioMetadatas])

  useEffect(() => {
    if (audioFiles.length === 0 && audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared())
    }
  }, [audioFiles])

  const convertStereoToMono = useCallback(() => {
    const formData = new FormData()
    formData.append('files', audioFiles[0])

    console.log("all files", formData.getAll("files"))
    dispatch(stereoToMono({ form: formData, params: stereoToMonoRequest}))

  }, [stereoToMonoRequest, audioFiles])
  
  return (
    <div>
      <h1>Stereo to Mono</h1>

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

          <div className="d-flex flex-column flex-sm-row justify-content-end mt-3">
            <Button 
              color="primary" 
              className="ms-sm-3"
              onClick={convertStereoToMono}
            >Convert stereo to mono</Button>
          </div>
        </>
      }

      
    </div>
  )
}