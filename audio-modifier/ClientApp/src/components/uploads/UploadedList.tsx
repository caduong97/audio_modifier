import { useDispatch, useSelector } from "react-redux"
import UploadedAudio from "./UploadedAudio"
import { AppDispatch, RootState } from "../../store"
import { audioMetadatasUpdated } from "../../store/mergeSlice";

export default function UploadedList() {
  const audioMetadatas = useSelector((state: RootState) => state.merge.audioMetadatas)
  const dispatch: AppDispatch = useDispatch()

  const moveAudioPosition = (dragIndex: number, hoverIndex: number) => {
    // Make a copy of the audiometadatas array for mutating
    const updatedAudioMetadatas = audioMetadatas.slice()
    // Get the dragged item out from the array
    const draggedItem = updatedAudioMetadatas.splice(dragIndex, 1)[0]
    // Reorder by inserted the dragged item back into the array at the hover index
    updatedAudioMetadatas.splice(hoverIndex, 0, draggedItem)
    // console.log("moveAudioPosition")
    // console.log("updated audio metadata", updatedAudioMetadatas)
    
    dispatch(audioMetadatasUpdated(updatedAudioMetadatas))
  }

  return (
    <div className="p-3 d-md-flex flex-wrap border border-1 rounded">
        {
          audioMetadatas.map((a, index) => {
            return (
              <UploadedAudio
                key={a.fileName}
                audioMetadata={a} 
                index={index}  
                moveAudioPosition={moveAudioPosition}
              />
            )
          })
        }
    </div>
  )
}