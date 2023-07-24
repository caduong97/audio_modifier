export default interface TrimAudioRequest {
  jobId: string
  start: number
  end: number
  outputFileName?: string
}
