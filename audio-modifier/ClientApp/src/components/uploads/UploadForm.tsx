import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Form, FormGroup, Input } from "reactstrap";
import { preprocessAudios } from "../../store/mergeSlice";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";

interface UploadFormProps {
  audioFiles: File[],
  setAudioFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export default function UploadForm({
  audioFiles,
  setAudioFiles
}: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch: AppDispatch = useDispatch()
  const preprocessStatus = useSelector((state: RootState) => state.merge.preprocessStatus)
  const [uploadFilesAborted, setUploadFilesAbort] = useState<boolean>(false)

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Cannot upload files: no files to upload")
    }

    const fileList = e.target.files as FileList
    console.log(e.target.files)

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      if (audioFiles.some(f => f.name === fileList[i].name)) {
        console.warn("Duplicated files detected. Make sure uploaded files have unique name. Duplicated file name:", fileList[i].name)
        continue
      }
      formData.append('files', fileList[i]);

    }

    console.log("Form files", formData.getAll("files"))
    if (formData.getAll("files").length === 0) {
      setUploadFilesAbort(true)
      return
    }


    console.log("There is some files to upload")
    setAudioFiles([...audioFiles, ...formData.getAll("files") as File[]])
    dispatch(preprocessAudios(formData))
  
    
  };

  useEffect(() => {
    if (preprocessStatus === 'fulfilled' || uploadFilesAborted ) {
      handleFilesClear()
      setUploadFilesAbort(false)
    }
  }, [preprocessStatus, uploadFilesAborted])




  const handleFilesClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the value of the file input
    }
  };

  return (
    <Form className="audio-upload-form">
      <FormGroup>
        <Input
          bsSize="sm"
          type="file"
          name="Audio files"
          placeholder="Upload audio files"
          multiple
          accept="audio/*" 
          innerRef={fileInputRef}
          onChange={handleFilesChange}
        />
        
      </FormGroup>
    </Form>
  )
}