import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiRequestStatus } from ".";
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";
import { create } from "domain";
import ApiHelper from "../helpers/ApiHelper";

interface ChannelSliceState {
  preprocessStatus: ApiRequestStatus,
  audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[],
}

export const channelSlice = createSlice({
  name: "trim",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    trimStatus: "idle"
  } as ChannelSliceState,
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
  'channel/preprocessAudio',
  async (form) => {
    const formFiles = form.getAll("file") as File[]
    if (formFiles[0].type === "audio/wav") {
      const response = await ApiHelper.postWithFiles('/channel/preprocessWavFile', form)
      return response.data as AudioMetadataWav
    } else if (formFiles[0].type === "audio/mpeg") {
      const response = await ApiHelper.postWithFiles('/channel/preprocessMp3File', form)
      return response.data as AudioMetadataMp3
    } else {
      throw new Error("Cannot perform batch preprocessing. Audio format not supported.")
    }
  }
)


export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = channelSlice.actions

const channelReducer = channelSlice.reducer
export default channelReducer
