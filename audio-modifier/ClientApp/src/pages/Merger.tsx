import { ChangeEvent, useState } from "react";
import UploadForm from "../components/uploads/UploadForm";
import UploadedList from "../components/uploads/UploadedList";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupText } from "reactstrap";
import { audioMetadatasCleared, mergeAudios } from "../store/mergeSlice";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import MergeAudioFilesRequest from "../models/merge/MergeAudioFilesRequest";
import { v4 as uuidv4 } from 'uuid';
import { CaretDownFill } from "react-bootstrap-icons";

export default function Merger() {
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
  const audioMetadatas = useSelector((state: RootState) => state.merge.audioMetadatas)
  // const [leadingSilence, setLeadingSilence] = useState<number>(0)
  // const [trailingSilence, setTrailingSilence] = useState<number>(0)
  // const [interval, setInterval] = useState<number>(0)
  // const [saveAs, setSaveAs] = useState<string>("")

  const [mergeAudioFilesRequest, setMergeAudioFilesRequest] = useState<MergeAudioFilesRequest>({
    jobId: uuidv4(),
    interval: 0,
    leadingSilence: 0,
    trailingSilence: 0
  })


  const handleClearQueue = () => {
    setAudioFiles([])
    dispatch(audioMetadatasCleared())
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleLeadingSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, leadingSilence: parseFloat(e.target.value)})
  }

  const handleTrailingSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, trailingSilence: parseFloat(e.target.value)})
  }

  const handleIntervalSilenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMergeAudioFilesRequest({...mergeAudioFilesRequest, interval: parseFloat(e.target.value)})
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
    const formData = new FormData();
    for (let i = 0; i < audioFiles.length; i++) {
      
      formData.append('files', audioFiles[i]);

    }
    console.log('handleMerge', formData.getAll("files"))

    dispatch(mergeAudios({ form: formData, params: mergeAudioFilesRequest}))
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
                  <Input type="number" placeholder="0" value={mergeAudioFilesRequest.leadingSilence} onChange={handleLeadingSilenceChange} />
                  <InputGroupText>
                    s
                  </InputGroupText>
                </InputGroup>
              </DropdownItem>
              <DropdownItem text className="d-flex align-items-center">
                <p className="w-100 mb-0 flex-grow-1">Trailing silence:</p>
                <InputGroup >
                  <Input type="number" placeholder="0" value={mergeAudioFilesRequest.trailingSilence} onChange={handleTrailingSilenceChange} />
                  <InputGroupText>
                    s
                  </InputGroupText>
                </InputGroup>
              </DropdownItem>
              <DropdownItem text className="d-flex align-items-center">
                <p className="w-100 mb-0 flex-grow-1">Interval:</p>
                <InputGroup >
                  <Input type="number" placeholder="0" value={mergeAudioFilesRequest.interval} onChange={handleIntervalSilenceChange} />
                  <InputGroupText>
                    s
                  </InputGroupText>
                </InputGroup>
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