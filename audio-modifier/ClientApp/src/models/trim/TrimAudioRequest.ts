export default interface TrimAudioRequest {
  jobId: string
  leadingSilence: number
  start: number
  end: number
  trailingSilence: number
  outputFileName?: string
}
