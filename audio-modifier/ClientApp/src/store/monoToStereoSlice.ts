import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiRequestStatus } from ".";
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";
import ApiHelper from "../helpers/ApiHelper";
import StereoToMonoRequest from "../models/channel/StereoToMonoRequest";

interface MonoToStereoState {
  preprocessStatus: ApiRequestStatus,
  audioMetadatas: (AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3)[],
}

export const monoToStereoSlice = createSlice({
  name: "monoToStereo",
  initialState: {
    preprocessStatus: 'idle',
    audioMetadatas: [],
    trimStatus: "idle"
  } as MonoToStereoState,
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

// TODO: wait for a while to see if all the preprocessAudio thunk in all the slices can be merged into one
// see #1_190923
export const preprocessAudio = createAsyncThunk<(AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3), FormData>(
  'monoToStereo/preprocessAudio',
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

interface StereoToMonoRequestPayload {
  form: FormData,
  params: StereoToMonoRequest
}

export const convert = createAsyncThunk<any, StereoToMonoRequestPayload>(
  'monoToStereo/convert', 
  async ({form, params}) => {
    const response = await ApiHelper.postForDownload('/channel/monoToStereo', form, params )
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


export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = monoToStereoSlice.actions

const monoToStereoReducer = monoToStereoSlice.reducer
export default monoToStereoReducer
