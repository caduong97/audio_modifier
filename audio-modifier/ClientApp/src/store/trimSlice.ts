import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelper from "../helpers/ApiHelper";
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";
import { ApiRequestStatus } from ".";

interface TrimSliceState {
  preprocessStatus: ApiRequestStatus,
  audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[],
  trimStatus: ApiRequestStatus,
}

export const trimSlice = createSlice({
  name: "trim",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    trimStatus: "idle"
  } as TrimSliceState,
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
      .addCase(preprocessAudio.pending, (state) => {
        state.preprocessStatus = "pending"
      })
      .addCase(preprocessAudio.fulfilled, (state, action) => {
        state.preprocessStatus = 'fulfilled'
        state.audioMetadatas.push(action.payload)
      })
      .addCase(preprocessAudio.rejected, (state) => {
        state.preprocessStatus = 'rejected'
      }) 
  }
})

export const preprocessAudio = createAsyncThunk<(AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3), FormData>(
  'trim/preprocessAudio', 
  async (form) => {
    const formFiles = form.getAll("file") as File[]
    if (formFiles.length === 0) {
      throw new Error("Cannot perform audio preprocessing. No audio file to process")
    }
    if (formFiles[0].type === "audio/wav") {
      const response = await ApiHelper.postWithFiles('/trim/preprocessWavFile', form)
      return response.data as AudioMetadataWav
    } else if (formFiles[0].type === "audio/mpeg") {
      const response = await ApiHelper.postWithFiles('/trim/preprocessMp3File', form)
      return response.data as AudioMetadataMp3
    } else {
      throw new Error("Cannot perform batch preprocessing. Audio format not supported.")
    }
    
  }
)

export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = trimSlice.actions;

const trimReducer = trimSlice.reducer;
export default trimReducer


