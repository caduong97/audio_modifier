import { useSelector } from "react-redux"
import UploadedAudio from "./UploadedAudio"
import { RootState } from "../../store"

export default function UploadedList() {
  const audioMetadatas = useSelector((state: RootState) => state.merge.audioMetadatas)

  return (
    <div className="p-3 d-md-flex flex-wrap border border-1 rounded">
      {
        audioMetadatas.map(a => {
          return (
            <UploadedAudio
              key={a.fileName}
              audioMetadata={a} />
          )
        })
      }
    </div>
  )
}