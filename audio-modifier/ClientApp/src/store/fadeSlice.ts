import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ApiRequestStatus, SliceStateBase } from "."
import ApiHelper from "../helpers/ApiHelper"
import { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata"
import PitchShiftRequest from "../models/pitch/PitchShiftRequest"
import FadeInOutRequest from "../models/fade/FadeInOutRequest"

interface FadeState extends SliceStateBase {
  fadeInOutStatus: ApiRequestStatus,
}

export const fadeSlice = createSlice({
  name: "fade",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    fadeInOutStatus: "idle"
  } as FadeState,
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

export const preprocessAudio = createAsyncThunk<(AudioMetadataWav | AudioMetadataMp3), FormData>(
  "fade/preprocessAudio",
  async (form: FormData) => {
    const formFiles = form.getAll("file") as File[]
    if (formFiles[0].type === "audio/wav") {
      const response = await ApiHelper.postWithFiles('/fade/preprocessWavFile', form)
      return response.data as AudioMetadataWav
    } else if (formFiles[0].type === "audio/mpeg") {
      const response = await ApiHelper.postWithFiles('/fade/preprocessMp3File', form)
      return response.data as AudioMetadataMp3
    } else {
      throw new Error("Cannot perform batch preprocessing. Audio format not supported.")
    }
  }
)

interface FadeInOutRequestPayload {
  form: FormData,
  params: FadeInOutRequest
}

export const fadeInOut = createAsyncThunk<any, FadeInOutRequestPayload>(
  "fade/fadeInOut",
  async ({form, params}) => {
    const response = await ApiHelper.postForDownload('/fade/inout', form, params )
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

export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = fadeSlice.actions

const fadeReducer = fadeSlice.reducer
export default fadeReducer