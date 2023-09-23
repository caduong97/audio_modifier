export default interface PitchShiftRequest {
  jobId: string
  pitch: number
  outputFileName?: string
}