import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { ChangeEvent, useState } from "react"
import UploadForm from "../components/uploads/UploadForm"
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, fadeInOut, preprocessAudio } from "../store/fadeSlice"
import { Button } from "reactstrap"
import { TouchBackend } from "react-dnd-touch-backend"
import { HTML5Backend } from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"
import UploadedList from "../components/uploads/UploadedList"
import SettingsDropdown from "../components/SettingsDropdown"
import SettingItem from "../components/SettingItem"
import FadeInOutRequest from "../models/fade/FadeInOutRequest"
import { v4 as uuidv4 } from 'uuid'

export default function FadeInOut() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.fade.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.fade.audioMetadatas)
  const [fadeInOutRequest, setFadeInOutRequest] = useState<FadeInOutRequest>({
    jobId: uuidv4(),
    fadeIn: 0,
    fadeOut: 0,
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
    // TODO: make it so that multiple files can be added to the ueue, but only the selected one will be processed, see all marked with #190923
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

  const handleFadeInChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFadeInOutRequest({ ...fadeInOutRequest, fadeIn: parseInt(e.target.value) })
  }

  const handleFadeOutChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFadeInOutRequest({ ...fadeInOutRequest, fadeOut: parseInt(e.target.value) })
  }

  const handleFadeInOut = () => {
    const formData = new FormData()
    for (let i = 0; i < audioFiles.length; i++) {
      formData.append("files", audioFiles[i])
    }
    dispatch(fadeInOut({form: formData, params: fadeInOutRequest}))
  }

  return (
    <div>
      <h1>Fade In Out</h1>
      
      <UploadForm
        multiple={false}
        audioFiles={audioFiles}
        setAudioFiles={setAudioFiles}
        submit={dispatchPreprocessAudioFiles}
        submitStatus={preprocessStatus}
      ></UploadForm>

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
            <SettingsDropdown
              toggleButtonText="Settings"
              title="Fade settings"
              width="400px"
            >
              <SettingItem
                name="Fade in:"
                type="number"
                min={0}
                max={null}
                unit="f"
                placeholder={0}
                value={fadeInOutRequest.fadeIn}
                onValueChange={handleFadeInChange}
                display="flex"
              ></SettingItem>
              <SettingItem
                name="Fade out:"
                type="number"
                min={0}
                max={null}
                unit="f"
                placeholder={0}
                value={fadeInOutRequest.fadeOut}
                onValueChange={handleFadeOutChange}
                display="flex"
              ></SettingItem>
            </SettingsDropdown>

            <Button 
              color="primary" 
              className="ms-sm-3"
              onClick={handleFadeInOut}
            >Fade</Button>


          </div>
        </>
      }
    </div>
  )
} 