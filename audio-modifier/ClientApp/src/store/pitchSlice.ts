import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ApiRequestStatus, SliceStateBase } from "."
import ApiHelper from "../helpers/ApiHelper"
import { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata"
import PitchShiftRequest from "../models/pitch/PitchShiftRequest"

interface PitchState extends SliceStateBase {
  pitchShiftStatus: ApiRequestStatus,
}

export const pitchSlice = createSlice({
  name: "pitch",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    pitchShiftStatus: "idle"
  } as PitchState,
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
  "pitch/preprocessAudio",
  async (form: FormData) => {
    const formFiles = form.getAll("file") as File[]
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

interface PitchShiftAudioRequestPayload {
  form: FormData,
  params: PitchShiftRequest
}

export const pitchShiftAudio = createAsyncThunk<any, PitchShiftAudioRequestPayload>(
  "pitch/pitchShiftAudio",
  async ({form, params}) => {
    const response = await ApiHelper.postForDownload('/pitch', form, params )
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

export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = pitchSlice.actions

const pitchReducer = pitchSlice.reducer
export default pitchReducer