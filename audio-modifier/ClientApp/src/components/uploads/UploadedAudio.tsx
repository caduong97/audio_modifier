import { Card, CardBody, CardHeader, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import AudioMetadata from "../../models/AudioMetadata";
import { timeSpanStringFormatted } from "../../helpers/DateHelper";


interface UploadedAudioProps {
  audioMetadata: AudioMetadata
}

export default function UploadedAudio({ audioMetadata }: UploadedAudioProps) {

  const sampleRateFormatted = audioMetadata.sampleRate / 1000 + "kHz"
  const durationFormatted = timeSpanStringFormatted(audioMetadata.duration)

  return (
    <Card
      color="light"
      className="mb-2 me-md-2 w-0"
      style={{
        width: '100%',
        maxWidth: '200px'
        
      }}
    >
      <CardHeader 
        style={{
          minHeight: '70px'
        }}
        className="d-flex justify-content-center align-items-center"
      >
        <MusicNoteBeamed className="" size={40} />
      </CardHeader>
      <CardBody>
        <CardTitle tag="h6">
          {audioMetadata.fileName}
        </CardTitle>
        <CardText className="m-0">
          Sample rate: {sampleRateFormatted}
        </CardText>
        <CardText className="m-0">
          Bits per sample: {audioMetadata.bitDepth}
        </CardText>
        <CardText className="m-0">
          Audio channel: {audioMetadata.channels}
        </CardText>
        <CardText className="m-0">
          Duration: {durationFormatted}
        </CardText>
        
      </CardBody>
    </Card>
  )
}