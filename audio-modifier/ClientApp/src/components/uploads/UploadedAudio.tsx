import { Button, Card, CardBody, CardHeader, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../../models/AudioMetadata";
import { timeSpanStringFormatted } from "../../helpers/DateHelper";
import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { Trash } from "react-bootstrap-icons";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { audioMetadataRemoved } from "../../store/mergeSlice";
import MoreInfo from "../MoreInfo";

interface UploadedAudioProps {
  audioMetadata: AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3
  index: number,
  moveAudioPosition: any
}

const type = "UploadedAudio"

export default function UploadedAudio({ audioMetadata, index, moveAudioPosition }: UploadedAudioProps) {
  const audioRef = useRef(null);

  // useDrop hook is responsible for handling whether any item gets hovered or dropped on the element
  const [, drop] = useDrop({
    // Accept will make sure only these element type can be droppable on this element
    accept: type,
    hover(item: any) {
      if (!audioRef.current) {
        return;
      }
      const dragIndex = item.index;
      // current element where the dragged element is hovered on
      const hoverIndex = index;
      // If the dragged element is hovered in the same place, then do nothing
      if (dragIndex === hoverIndex) { 
        return;
      }
      // If it is dragged around other elements, then move the image and set the state with position changes
      moveAudioPosition(dragIndex, hoverIndex);
      /*
        Update the index for dragged item directly to avoid flickering
        when the image was half dragged into the next
      */
      item.index = hoverIndex;
    }
  });

  // useDrag will be responsible for making an element draggable. It also expose, isDragging method to add any styles while dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    // what type of item this to determine if a drop target accepts it
    type: type,
    // data of the item to be available to the drop methods
    item: { id: audioMetadata.fileName, index },
    // method to collect additional data for drop handling like whether is currently being dragged
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  }));

  drag(drop(audioRef));

  const sampleRateFormatted = audioMetadata.sampleRate / 1000 + "kHz"

  const dispatch: AppDispatch = useDispatch()

  const handleAudioRemove = () => {
    dispatch(audioMetadataRemoved(audioMetadata.fileName))
  }

  return (
    <Card
      innerRef={audioRef}
      color="light"
      className="mb-2 me-md-2 w-0"
      style={{
        width: '100%',
        maxWidth: '230px',
        opacity: isDragging ? 0.3 : 1
      }}
    >
      <CardHeader 
        style={{
          minHeight: '70px'
        }}
        className="d-flex justify-content-between"
      >
        {index + 1}
        <MusicNoteBeamed className="align-self-center" size={40} />
        <Button 
          className="px-1 py-1 mx-0"  
          color="danger"
          outline
          style={{ height: 'max-content' }} 
          onClick={handleAudioRemove}
          id="DeleteButton"
        >
          <Trash size={20} />
        </Button>
        <MoreInfo target="DeleteButton">Remove from queue</MoreInfo>
      </CardHeader>
      <CardBody>
        <CardTitle tag="h6">
          {audioMetadata.fileName}
        </CardTitle>
        <CardText className="m-0">
          Sample rate: {sampleRateFormatted}
        </CardText>
        {
          (audioMetadata as AudioMetadataWav).bitDepth &&
          <>
            <CardText className="m-0">
              Bits per sample: {(audioMetadata as AudioMetadataWav).bitDepth}
            </CardText>
            <CardText className="m-0">
              Audio channels: {(audioMetadata as AudioMetadataWav).channels}
            </CardText>
            <CardText className="m-0">
              Duration: {timeSpanStringFormatted((audioMetadata as AudioMetadataWav).duration)}
            </CardText>
          </>
        }

        {
          (audioMetadata as AudioMetadataMp3).bitRate &&
          <>
            <CardText className="m-0">
              Audio channels: {(audioMetadata as AudioMetadataMp3).channelMode}
            </CardText>
          </>
        }
        
      </CardBody>
    </Card>
  )
}