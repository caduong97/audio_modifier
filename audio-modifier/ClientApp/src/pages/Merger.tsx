import { ChangeEvent, useEffect, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import UploadedList from "../components/uploads/UploadedList";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, InputGroupText, Label, Tooltip, UncontrolledTooltip } from "reactstrap";
import { audioMetadatasCleared, mergeAudios } from "../store/mergeSlice";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import MergeAudioFilesRequest from "../models/merge/MergeAudioFilesRequest";
import { v4 as uuidv4 } from 'uuid';
import { CaretDownFill } from "react-bootstrap-icons";
import AudioIntervalType from "../models/AudioIntervalTypeEnum";
import { InfoCircleFill } from "react-bootstrap-icons";


export default function Merger() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [intervalType, setIntervalType] = useState<number>(0)
  const dispatch: AppDispatch = useDispatch()
  const audioMetadatas = useSelector((state: RootState) => state.merge.audioMetadatas)

  const [mergeAudioFilesRequest, setMergeAudioFilesRequest] = useState<MergeAudioFilesRequest>({
    jobId: uuidv4(),
    leadingSilence: 0,
    sharedInterval: 0,
    individualIntervals: {},
  })


  const handleClearQueue = () => {
    setAudioFiles([])
    setIntervalType(0)
    dispatch(audioMetadatasCleared())
  }

  useEffect(() => {
    if (intervalType === AudioIntervalType.Individual_Interval && 
      audioFiles.length > 0
    ) {
      audioFiles.forEach(au => {
        if (mergeAudioFilesRequest.individualIntervals[au.name] == null) {
          const updatedIndividualIntervals = {...mergeAudioFilesRequest.individualIntervals}
          updatedIndividualIntervals[au.name] = 0
          setMergeAudioFilesRequest({...mergeAudioFilesRequest, individualIntervals: {...updatedIndividualIntervals}})
        }
      });  
    }
    if (audioFiles.length === 0) {
      setMergeAudioFilesRequest({...mergeAudioFilesRequest, individualIntervals: {}})
    }

  }, [audioFiles, intervalType])

  const toggle = () => setDropdownOpen((prevState) => !prevState);

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

      <UploadForm audioFiles={audioFiles} setAudioFiles={setAudioFiles}/>

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
        
        
        <UploadedList/>

        <div className="d-flex flex-column flex-sm-row justify-content-end mt-3">
          <Dropdown 
            isOpen={dropdownOpen} toggle={toggle} direction="down"
            className="w-100 me-sm-3"
            style={{
              minWidth: '340px'
            }}  
          >
            <DropdownToggle caret color="info" outline className="mb-3 mb-sm-0 ms-auto d-block">Settings</DropdownToggle>
            <DropdownMenu end className="w-100"
              style={{
                maxWidth: '340px'
              }}  
            >
              <DropdownItem header>Advanced</DropdownItem>
              <DropdownItem divider />
              <DropdownItem text className="d-flex align-items-center">
                <p className="w-100 mb-0 flex-grow-1">Leading silence:</p>
                <InputGroup >
                  <Input type="number" min={0}  placeholder="0" value={mergeAudioFilesRequest.leadingSilence} onChange={handleLeadingSilenceChange} />
                  <InputGroupText>
                    s
                  </InputGroupText>
                </InputGroup>
              </DropdownItem>
              <DropdownItem text className="">
                <p className="w-100 d-flex align-items-center">
                  Intervals
                  <InfoCircleFill className="ms-2" id="TooltipExample"/>
                </p>
                <UncontrolledTooltip
                  placement="top"
                  autohide={false}
                  target="TooltipExample"
                >
                  <p className="text-start">
                  Set interval in seconds at the end of each audio file, including the last file in queue. <br /> 
                  <b>Shared Interval</b> applies the same interval for all files. <br /> 
                  <b>Individual Interval</b> allow specify a different interval for each individual file.
                  </p>
                </UncontrolledTooltip>

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
                          {' '}
                          {o.description}
                        </Label>
                        {
                          (o.id == AudioIntervalType.Shared_Interval && intervalType == AudioIntervalType.Shared_Interval) &&
                          <InputGroup className="w-50">
                            <Input type="number" min={0} placeholder="0" value={mergeAudioFilesRequest.sharedInterval} onChange={handleSharedIntervalSilenceChange} />
                            <InputGroupText>
                              s
                            </InputGroupText>
                          </InputGroup>
                        }

                        {
                          (o.id == AudioIntervalType.Individual_Interval && intervalType == AudioIntervalType.Individual_Interval) &&
                          audioFiles.map((au, index) => (
                            <DropdownItem text className="d-flex align-items-center px-0" key={`individu-inter-${index}`}>
                              <p 
                                className="w-75 flex-grow-1 mb-0 text-nowrap" 
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>{index + 1}. {au.name}</p>
                              <InputGroup className="w-50">
                                <Input type="number" min={0} placeholder="0" value={mergeAudioFilesRequest.individualIntervals[au.name]} onChange={(e) => handleIndividualIntervalsSilenceChange(e,au.name)} />
                                <InputGroupText>
                                  s
                                </InputGroupText>
                              </InputGroup>
                            </DropdownItem>
                          ))
                          
                        }
                        
                      </FormGroup>
                    )
                  }
                </FormGroup>
                <br />
              </DropdownItem>
              <DropdownItem text>
                Save as:
                <Input
                  className="mt-2"
                  placeholder="Filename..."
                  value={mergeAudioFilesRequest.outputFileName}
                  onChange={handleSaveAsChange}
                />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

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