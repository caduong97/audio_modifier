export default interface MergeAudioFilesRequest {
  jobId: string
  interval: number
  leadingSilence: number
  trailingSilence: number
  outputFileName?: string
}