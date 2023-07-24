import { ChangeEvent, useEffect, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import UploadedList from "../components/uploads/UploadedList";
import { Button, DropdownItem, FormGroup, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import { audioMetadataRemoved, audioMetadatasCleared, audioMetadatasUpdated, mergeAudios, preprocessAudios } from "../store/mergeSlice";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import MergeAudioFilesRequest from "../models/merge/MergeAudioFilesRequest";
import { v4 as uuidv4 } from 'uuid';
import AudioIntervalType from "../models/AudioIntervalTypeEnum";
import { InfoCircleFill } from "react-bootstrap-icons";
import SettingsDropdown from "../components/SettingsDropdown";
import SettingItem from "../components/SettingItem";
import MoreInfo from "../components/MoreInfo";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import AudioMetadataBase, { AudioMetadataWav, AudioMetadataMp3 } from "../models/AudioMetadata";


export default function Merger() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const [intervalType, setIntervalType] = useState<number>(0)
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.merge.preprocessStatus)
  const audioMetadatas = useSelector((state: RootState) => state.merge.audioMetadatas)

  const [mergeAudioFilesRequest, setMergeAudioFilesRequest] = useState<MergeAudioFilesRequest>({
    jobId: uuidv4(),
    leadingSilence: 0,
    sharedInterval: 0,
    individualIntervals: {},
  })

  const dispatchPreprocessAudioFiles = (formData: FormData) => {
    dispatch(preprocessAudios(formData))
  }


  const handleClearQueue = () => {
    setAudioFiles([])
    setIntervalType(0)
    dispatch(audioMetadatasCleared())
  }

  const dispatchUpdateAudioList = (audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[]) => {
    dispatch(audioMetadatasUpdated(audioMetadatas))
  }

  const dispatchAudioRemove = (fileName: string) => {
    dispatch(audioMetadataRemoved(fileName))
  }

  useEffect(() => {

    if (audioMetadatas.length > 0) {
      audioMetadatas.forEach(au => {
        if (mergeAudioFilesRequest.individualIntervals[au.fileName] == null) {
          const updatedIndividualIntervals = {...mergeAudioFilesRequest.individualIntervals}
          updatedIndividualIntervals[au.fileName] = 0
          setMergeAudioFilesRequest({...mergeAudioFilesRequest, individualIntervals: {...updatedIndividualIntervals}})
        }
      }) 
    }

    if (audioMetadatas.length === 0) {
      setMergeAudioFilesRequest({...mergeAudioFilesRequest, individualIntervals: {}})
      
    }

  }, [audioMetadatas])

  useEffect(() => {
    if (audioFiles.length === 0 && audioMetadatas.length > 0) {
      dispatch(audioMetadatasCleared())
    }
  }, [audioFiles])

  const isTouchDevice = () => {
    if ("ontouchstart" in window) {
      return true;
    }
    return false;
  };

  // Assigning backend based on touch support on the device
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

  const handleLeadingSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, leadingSilence: parseFloat(e.target.value)})
  }

  const handleSharedIntervalSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, sharedInterval: parseFloat(e.target.value)})
  }

  const intevalTypeTexts = () => {
    const enumeration = AudioIntervalType;
    const separatorRegex = /_/g;
    return (Object.keys(enumeration) as Array<keyof AudioIntervalType>)
      .filter(key => isNaN(Number(key)))
      .filter(key => typeof enumeration[key as any] === "number" || typeof enumeration[key as any] === "string")
      .map(key => ({
          id: parseInt(enumeration[key as any]),
          description: String(key).replace(separatorRegex, ' '),
      }));
  }

  const handleIndividualIntervalsSilenceChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const updatedIndividualIntervals = {...mergeAudioFilesRequest.individualIntervals}
    updatedIndividualIntervals[key] = parseInt(e.target.value, 10)
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, individualIntervals: {...updatedIndividualIntervals}})
  }

  const handleIntervalTypeChange = (e: any) => {
    setIntervalType(e)
  }

  const handleSaveAsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, outputFileName: e.target.value})
  }

  const handleMerge = () => {
    // const request: MergeAudioFilesRequest = {
    //   jobId: uuidv4(),
    //   interval: 0,
    //   leadingSilence: 1,
    //   trailingSilence: 3
    // }
    const request = {...mergeAudioFilesRequest}
    if (intervalType === AudioIntervalType.Shared_Interval) {
      request.individualIntervals = {}
    } else if (intervalType === AudioIntervalType.Individual_Interval) {
      request.sharedInterval = 0
    }
    // console.log("handleMerge", request)

    const formData = new FormData();
    for (let i = 0; i < audioFiles.length; i++) {
      
      formData.append('files', audioFiles[i]);

    }
    console.log('handleMerge', formData.getAll("files"))

    dispatch(mergeAudios({ form: formData, params: request}))
  }

  return (
    <div>
      <h1>Merger</h1>

      <UploadForm 
        multiple
        audioFiles={audioFiles} 
        setAudioFiles={setAudioFiles} 
        submit={dispatchPreprocessAudioFiles}
        submitStatus={preprocessStatus}
      />

      {
        audioMetadatas.length > 0 &&
        <>
          <div className="mt-5 mb-2 w-100 d-flex justify-content-between align-items-center">
          <h5 className="d-inline">File queue</h5>
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
                value={mergeAudioFilesRequest.leadingSilence}
                onValueChange={handleLeadingSilenceChange}
                display="flex"
              ></SettingItem>
              

              <DropdownItem text className="">
                <p className="w-100 d-flex align-items-center">
                  Intervals
                  <InfoCircleFill className="ms-2" id="TooltipExample"/>
                </p>
                <MoreInfo target="TooltipExample">
                  <p className="text-start">
                  Set interval in seconds at the end of each audio file, including the last file in queue. <br /> 
                  <b>Shared Interval</b> applies the same interval for all files. <br /> 
                  <b>Individual Interval</b> allow specify a different interval for each individual file.
                  </p>
                </MoreInfo>

                <FormGroup                            >
                  {
                    intevalTypeTexts().map(o => 
                      <FormGroup 
                        check key={`key-${o.id}`}
                        className={o.id === AudioIntervalType.Shared_Interval ? "d-flex align-items-center" : "d-block"}
                        onClick={() => handleIntervalTypeChange(o.id)}
                      >
                        <Label htmlFor={o.id.toString()} check className="w-100 flex-grow-1 mb-2">
                          <Input
                            id={o.id.toString()}
                            name="intervalType"
                            type="radio"
                            value={o.id}
                            checked={intervalType === o.id}
                            onChange={() => {}}
                          />
                          {' '}{o.description}
                        </Label>
                        {
                          (o.id === AudioIntervalType.Shared_Interval && intervalType === AudioIntervalType.Shared_Interval) &&
                          <InputGroup className="w-50">
                            <Input type="number" min={0} placeholder="0" value={mergeAudioFilesRequest.sharedInterval} onChange={handleSharedIntervalSilenceChange} />
                            <InputGroupText>
                              s
                            </InputGroupText>
                          </InputGroup>
                        }

                        {
                          (o.id === AudioIntervalType.Individual_Interval && intervalType === AudioIntervalType.Individual_Interval) &&
                          audioMetadatas.map((au, index) => (
                            <SettingItem
                              key={`individu-inter-${index}`}
                              name={`${index + 1}. ${au.fileName}`}
                              type="number"
                              min={0}
                              max={null}
                              unit="s"
                              placeholder={0}
                              value={mergeAudioFilesRequest.individualIntervals[au.fileName]}
                              onValueChange={(e) => handleIndividualIntervalsSilenceChange(e,au.fileName)}
                              display="flex"
                              truncateName
                              itemPaddingX="px-0"
                            ></SettingItem>
                          ))
                          
                        }
                        
                      </FormGroup>
                    )
                  }
                </FormGroup>
                <br />
              </DropdownItem>

              <SettingItem
                name="Save as:"
                type="text"
                placeholder="Filename..."
                value={mergeAudioFilesRequest.outputFileName}
                onValueChange={handleSaveAsChange}
                display="block"
              ></SettingItem>

            </div>
          </SettingsDropdown>

          <Button 
            color="primary" 
            className=""
            onClick={handleMerge}
          >Merge</Button>
        </div>
      </>
      }

      
    </div>
  )
}