import { useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import Waveform from "../components/waveform/Waveform";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, preprocessAudio } from "../store/trimSlice";
import TrimAudioRequest from "../models/trim/TrimAudioRequest";
import { v4 as uuidv4 } from 'uuid';
import UploadedList from "../components/uploads/UploadedList";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { Button } from "reactstrap";

export default function Trimmer() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.trim.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.trim.audioMetadatas)

  const [trimAudioRequest, setTrimAudioRequest] = useState<TrimAudioRequest>({
    jobId: uuidv4(),
    start: 0,
    end: 0,
  })


  const url = audioFiles.length > 0 ? URL.createObjectURL(audioFiles[0]) : ""

  const isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  };
  // Assigning backend based on touch support on the device
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  const dispatchPreprocessAudioFiles = (formData: FormData) => {
    // TODO: dispatch preprocess audios action in trimSlice
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

  const updateTrimSettings = (start: number, end: number) => {
    setTrimAudioRequest({...trimAudioRequest, start: start, end: end})
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
        audioMetadatas.length === 1 &&
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

          {
            url !== "" &&
            <Waveform 
              url={url}
              trimMode
              updateTrimSettings={updateTrimSettings}
            ></Waveform>
          }       
        </>
      }

     
    </div>
  )
}