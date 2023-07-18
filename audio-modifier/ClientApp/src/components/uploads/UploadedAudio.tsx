import { Card, CardBody, CardHeader, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { MusicNoteBeamed } from 'react-bootstrap-icons';
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../../models/AudioMetadata";
import { timeSpanStringFormatted } from "../../helpers/DateHelper";


interface UploadedAudioProps {
  audioMetadata: AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3
}

export default function UploadedAudio({ audioMetadata }: UploadedAudioProps) {

  const sampleRateFormatted = audioMetadata.sampleRate / 1000 + "kHz"
  // const durationFormatted = (audioMetadata as AudioMetadataWav).duration 
  //   ? timeSpanStringFormatted((audioMetadata as AudioMetadataWav).duration)
  //   : null

  return (
    <Card
      color="light"
      className="mb-2 me-md-2 w-0"
      style={{
        width: '100%',
        maxWidth: '230px'
        
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