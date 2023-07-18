type IndividualIntervals = Record<string, number>

export default interface MergeAudioFilesRequest {
  jobId: string
  sharedInterval: number
  individualIntervals: IndividualIntervals
  leadingSilence: number
  outputFileName?: string
}