import { useCallback, useEffect, useState } from "react"
import { AppDispatch, RootState } from "../store"
import { useDispatch, useSelector } from "react-redux"
import UploadForm from "../components/uploads/UploadForm"
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, convert, preprocessAudio } from "../store/monoToStereoSlice"
import { TouchBackend } from "react-dnd-touch-backend"
import { HTML5Backend } from "react-dnd-html5-backend"
import MonoToStereoRequest from "../models/channel/MonoToStereoRequest"
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from "react-dnd"
import UploadedList from "../components/uploads/UploadedList"
import { Button } from "reactstrap"
import { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata"

export default function MonoToStereo() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.monoToStereo.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.monoToStereo.audioMetadatas)

  const [monoToStereoRequest, setMonoToStereoRequest] = useState<MonoToStereoRequest>({
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
    audioMetadatas.forEach((audioMetadata) => {
      if ((audioMetadata as AudioMetadataWav).channels === 2 || (audioMetadata as AudioMetadataMp3).channelMode === "stereo") {
        alert(`${audioMetadata.fileName} is already stereo. Aborting...`)
        dispatch(audioMetadataRemoved(audioMetadata.fileName))
      }
    })
  }, [audioMetadatas])

  useEffect(() => {
    if (audioFiles.length === 0 && audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared())
    }
  }, [audioFiles])

  const convertMonoToStereo = useCallback(() => {
    const formData = new FormData()
    formData.append('files', audioFiles[0])

    console.log("all files", formData.getAll("files"))
    dispatch(convert({ form: formData, params: monoToStereoRequest}))

  }, [monoToStereoRequest, audioFiles])


  return (
    <div>
      <h1>Mono to Stereo</h1>

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
              onClick={convertMonoToStereo}
            >Convert mono to stereo</Button>
          </div>
        </>
      }

    </div>
  )
}
