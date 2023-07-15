export default interface AudioMetadataBase {
  fileName: string;
  sampleRate: number;
}

export interface AudioMetadataWav extends AudioMetadataBase {
  bitDepth: number;
  channels: number;
  duration: string;
}

export interface AudioMetadataMp3 extends AudioMetadataBase {
  bitRate: number;
  channelMode: string;
  layer: string;
  format: string;
  copyright: boolean;
}