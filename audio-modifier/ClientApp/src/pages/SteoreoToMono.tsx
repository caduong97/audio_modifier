import { useEffect, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, preprocessAudio } from "../store/channelSlice";
import { DndProvider } from "react-dnd";
import UploadedList from "../components/uploads/UploadedList";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "reactstrap";
import { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";

export default function SteoreoToMono() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.channel.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.channel.audioMetadatas)

  const isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  };

  // Assigning backend based on touch support on the device
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  const dispatchPreprocessAudioFiles = (formData: FormData) => {
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
        </>
      }

      
    </div>
  )
}