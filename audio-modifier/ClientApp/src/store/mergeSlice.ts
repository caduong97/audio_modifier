import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelper from "../helpers/ApiHelper";
import AudioMetadata from "../models/AudioMetadata";
import { ApiRequestStatus } from ".";
import MergeAudioFilesRequest from "../models/merge/MergeAudioFilesRequest";

interface MergeSliceState {
  preprocessStatus: ApiRequestStatus,
  audioMetadatas: AudioMetadata[]
  audioFiles: File[]
  mergeStatus: ApiRequestStatus,

}

export const mergeSlice = createSlice({
  name: "merge",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    audioFiles: [],
    mergeStatus: "idle"
  } as MergeSliceState,
  reducers: {
    audioMetadatasCleared(state) {
      state.audioMetadatas = []
    } 
  },
  extraReducers(builder) {
    builder
      .addCase(preprocessAudios.pending, (state) => {
        state.preprocessStatus = "pending"
      })
      .addCase(preprocessAudios.fulfilled, (state, action) => {
        state.preprocessStatus = 'fulfilled'
        state.audioMetadatas.push(...action.payload)
      })
      .addCase(preprocessAudios.rejected, (state) => {
        state.preprocessStatus = 'rejected'
      }) 
      .addCase(mergeAudios.pending, (state) => {
        state.mergeStatus = "pending"
      })
      .addCase(mergeAudios.fulfilled, (state, action) => {
        state.mergeStatus = 'fulfilled'
        // console.log("mergeAudios.fulfilled", action.payload)
      })
      .addCase(mergeAudios.rejected, (state) => {
        state.mergeStatus = 'rejected'
      }) 
  }
    
})

export const preprocessAudios = createAsyncThunk<AudioMetadata[], FormData>(
  'merge/preprocessAudiosForMerging', 
  async (files) => {
    const response = await ApiHelper.postWithFiles('/merge/preprocessAudiosForMerging', files)
    return response.data as AudioMetadata[]
  }
)

interface MergeAudiosRequestPayload {
  form: FormData,
  params: MergeAudioFilesRequest
}

export const mergeAudios = createAsyncThunk<any, MergeAudiosRequestPayload>(
  'merge/mergeAudios', 
  async ({form, params}) => {
    const response = await ApiHelper.postForDownload('/merge', form, params )
    const downloadUrl = URL.createObjectURL(response.data as any);
    const link = document.createElement('a');
    link.href = downloadUrl;
    const contentDisposition = response.headers['content-disposition'];
    let fileName
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      // console.log('fileNameMatch', fileNameMatch);
      if (fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }
    link.download = fileName; // Set the desired file name
    link.click();
    // return response.data as Blob
  }
)




export const { audioMetadatasCleared } = mergeSlice.actions;

const mergeReducer = mergeSlice.reducer;
export default mergeReducer
