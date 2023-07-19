import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelper from "../helpers/ApiHelper";
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";
import { ApiRequestStatus } from ".";
import MergeAudioFilesRequest from "../models/merge/MergeAudioFilesRequest";

interface MergeSliceState {
  preprocessStatus: ApiRequestStatus,
  audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[]
  mergeStatus: ApiRequestStatus,

}

export const mergeSlice = createSlice({
  name: "merge",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    mergeStatus: "idle"
  } as MergeSliceState,
  reducers: {
    audioMetadatasCleared(state) {
      state.audioMetadatas = []
    },
    audioMetadatasUpdated(state, action) {
      state.audioMetadatas = action.payload
    },
    audioMetadataRemoved(state, action) {
      state.audioMetadatas = state.audioMetadatas.filter(au => au.fileName !== action.payload)
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

export const preprocessAudios = createAsyncThunk<(AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[], FormData>(
  'merge/preprocessAudiosForMerging', 
  async (form) => {
    const formFiles = form.getAll("files") as File[]
    if (formFiles.some(f => f.type !== formFiles[0].type)) {
      throw new Error("Cannot perform audio batch preprocessing. Inconsistent file extensions detected.")
    }
    if (formFiles[0].type === "audio/wav") {
      const response = await ApiHelper.postWithFiles('/merge/preprocessWavFiles', form)
      return response.data as AudioMetadataWav[]
    } else if (formFiles[0].type === "audio/mpeg") {
      const response = await ApiHelper.postWithFiles('/merge/preprocessMp3Files', form)
      return response.data as AudioMetadataMp3[]
    } else {
      throw new Error("Cannot perform audio batch preprocessing. Audio format not supported.")
    }
    
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




export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = mergeSlice.actions;

const mergeReducer = mergeSlice.reducer;
export default mergeReducer
