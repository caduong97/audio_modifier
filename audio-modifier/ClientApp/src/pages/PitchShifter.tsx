import { ChangeEvent, useEffect, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import UploadedList from "../components/uploads/UploadedList";
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, pitchShiftAudio, preprocessAudio } from "../store/pitchSlice";
import { Button } from "reactstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import SettingsDropdown from "../components/SettingsDropdown";
import PitchShiftRequest from "../models/pitch/PitchShiftRequest";
import { v4 as uuidv4 } from 'uuid';
import SettingItem from "../components/SettingItem";

export default function PitchShifter() {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const preprocessStatus = useSelector((state: RootState) => state.pitch.preprocessStatus);
  const audioMetadatas = useSelector((state: RootState) => state.pitch.audioMetadatas);
  const dispatch: AppDispatch = useDispatch()
  const [pitchShiftRequest, setPitchShiftRequest] = useState<PitchShiftRequest>({
    jobId: uuidv4(),
    pitch: 1,
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
  
  const dispatchAudioPreprocess = (formData: FormData) => {
    // TODO: make it so that multiple files can be added to the queue, but only the selected one will be processed, see all marked with #190923
    // Once that's done, the following 3 lines can be removed
    if (audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared());
    }
    dispatch(preprocessAudio(formData));
  };

  const handleClearQueue = () => {
    setAudioFiles([]);
    dispatch(audioMetadatasCleared());
  };

  const dispatchUpdateAudioList = () => {
    dispatch(audioMetadatasUpdated(audioMetadatas));
  };

  const dispatchAudioRemove = (fileName: string) => {
    dispatch(audioMetadataRemoved(fileName));
  };

  useEffect(() => {
    if (audioMetadatas.length === 0) {
      
    }
  }, [audioMetadatas])

  useEffect(() => {
    if (audioFiles.length === 0 && audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared())
    }
  }, [audioFiles])

  const handlePitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPitchShiftRequest({...pitchShiftRequest, pitch: parseFloat(e.target.value)})
  }

  const handleSaveAsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPitchShiftRequest({...pitchShiftRequest, outputFileName: e.target.value})
  }

  const handlePitchShift = () => {
    const formData = new FormData()
    for (let i = 0; i < audioFiles.length; i++) {
      formData.append("files", audioFiles[i])
    }
    dispatch(pitchShiftAudio({form: formData, params: pitchShiftRequest}))
  }

  return (
    <div>
      <h1>Pitch Shifter</h1>

      <UploadForm
        multiple={false}
        audioFiles={audioFiles}
        setAudioFiles={setAudioFiles}
        submit={dispatchAudioPreprocess}
        submitStatus={preprocessStatus}
      ></UploadForm>

      {audioMetadatas.length > 0 &&
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
            ></UploadedList>
          </DndProvider>

          <div className="d-flex flex-column flex-sm-row justify-content-end mt-3">

            <SettingsDropdown
              toggleButtonText="Settings"
              title="Advanced"
              width="400px"
            >
              <SettingItem
                name="Pitch:"
                type="number"
                min={0}
                max={null}
                unit="f"
                placeholder={0}
                value={pitchShiftRequest.pitch}
                onValueChange={handlePitchChange}
                display="flex"
              ></SettingItem>

              <SettingItem
                name="Save as:"
                type="text"
                placeholder="Filename..."
                value={pitchShiftRequest.outputFileName}
                onValueChange={handleSaveAsChange}
                display="block"
              ></SettingItem>

            </SettingsDropdown>

            <Button 
              color="primary" 
              className="ms-sm-3"
              onClick={handlePitchShift}
            >Pitch</Button>

          </div>
        </>}
    </div>
  );
}
