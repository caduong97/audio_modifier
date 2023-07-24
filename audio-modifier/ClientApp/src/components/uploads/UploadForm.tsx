import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Form, FormGroup, Input } from "reactstrap";
import { preprocessAudios } from "../../store/mergeSlice";
import { ApiRequestStatus, AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";

interface UploadFormProps {
  multiple: boolean,
  audioFiles: File[],
  setAudioFiles: React.Dispatch<React.SetStateAction<File[]>>,
  submit: (formData: FormData) => void
  submitStatus: ApiRequestStatus
}

export default function UploadForm({
  multiple,
  audioFiles,
  setAudioFiles,
  submit,
  submitStatus
}: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const preprocessStatus = useSelector((state: RootState) => state.merge.preprocessStatus)
  const [uploadFilesAborted, setUploadFilesAbort] = useState<boolean>(false)

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Cannot upload files: no files to upload")
    }

    const fileList = e.target.files as FileList
    console.log(fileList)
    if (fileList.length === 0) {
      return
    }

    const formData = new FormData();

    if (multiple) {
      try {
        for (let i = 0; i < fileList.length; i++) {
          // One of the uploaded files has the same name with one of the in-queue files
          // abort that file, continue uploading other files
          if (audioFiles.some(f => f.name === fileList[i].name)) {
            console.warn("Duplicated files detected. Make sure uploaded files have unique name. Duplicated file name:", fileList[i].name)
            continue
          }
          // One of the uploaded files has a different extension than the in-queue files
          // abort that file, continue upload other files with the same extension
          if (audioFiles.length > 0 && audioFiles[0].type !== fileList[i].type) {
            console.warn("Multiple file extensions detected. Please convert all files to the same extension first. \r\n Uploading of some file was aborted. File name: ", fileList[i].name)
            continue
          }
          // No in-queue files yet, & uploaded files have differnt extensions
          // abort all of them
          if (audioFiles.length === 0 && fileList[i].type !== fileList[0].type) {
            setUploadFilesAbort(true)
            throw Error("Multiple file extensions detected. Please convert all files to the same extension first.") 
          }
          formData.append('files', fileList[i]);
        } 
  
      }
      catch (error) {
        console.error(error)
        return
      }
  
      // console.log("Form files", formData.getAll("files"))
      if (formData.getAll("files").length === 0) {
        setUploadFilesAbort(true)
        return
      }
  
      // console.log("There is some files to upload")
      setAudioFiles([...audioFiles, ...formData.getAll("files") as File[]])
    } else {
      formData.append('file', fileList[0]);
      setAudioFiles([formData.get("file") as File])

    }
    
    submit(formData)
  
  };


  useEffect(() => {
    if (submitStatus === 'fulfilled' || uploadFilesAborted ) {
      handleFilesClear()
      setUploadFilesAbort(false)
    }
  }, [submitStatus, uploadFilesAborted])




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
          multiple={multiple}
          accept="audio/*" 
          innerRef={fileInputRef}
          onChange={handleFilesChange}
        />
        
      </FormGroup>
    </Form>
  )
}