import { useDispatch } from "react-redux"
import UploadedAudio from "./UploadedAudio"
import { AppDispatch } from "../../store"
import AudioMetadataBase, { AudioMetadataWav, AudioMetadataMp3 } from "../../models/AudioMetadata";

interface UploadedListProps {
  audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[]
  updateList: (audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[]) => void
  removeListItem: (fileName: string) => void
}

export default function UploadedList({
  audioMetadatas,
  updateList,
  removeListItem
}: UploadedListProps) {

  const moveAudioPosition = (dragIndex: number, hoverIndex: number) => {
    // Make a copy of the audiometadatas array for mutating
    const updatedAudioMetadatas = audioMetadatas.slice()
    // Get the dragged item out from the array
    const draggedItem = updatedAudioMetadatas.splice(dragIndex, 1)[0]
    // Reorder by inserted the dragged item back into the array at the hover index
    updatedAudioMetadatas.splice(hoverIndex, 0, draggedItem)
    // console.log("moveAudioPosition")
    // console.log("updated audio metadata", updatedAudioMetadatas)
    
    updateList(updatedAudioMetadatas)
  }

  // TODO: make audio in queue selectable, search items marked with #190923

  return (
    <div className="p-3 d-md-flex flex-wrap border border-1 rounded">
        {
          audioMetadatas.map((a, index) => {
            return (
              <UploadedAudio
                key={`${index}-${a.fileName}`}
                audioMetadata={a} 
                index={index}  
                moveAudioPosition={moveAudioPosition}
                remove={removeListItem}
              />
            )
          })
        }
    </div>
  )
}