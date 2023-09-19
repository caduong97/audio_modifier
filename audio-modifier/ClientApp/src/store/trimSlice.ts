import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelper from "../helpers/ApiHelper";
import AudioMetadataBase, { AudioMetadataMp3, AudioMetadataWav } from "../models/AudioMetadata";
import { ApiRequestStatus } from ".";
import TrimAudioRequest from "../models/trim/TrimAudioRequest";

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

// TODO: wait for a while to see if all the preprocessAudio thunk in all the slices can be merged into one
// see #1_190923
export const preprocessAudio = createAsyncThunk<(AudioMetadataBase | AudioMetadataWav | AudioMetadataMp3), FormData>(
  'trim/preprocessAudio', 
  async (form) => {
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

interface TrimAudioRequestPayload {
  form: FormData,
  params: TrimAudioRequest
}

export const trimAudio = createAsyncThunk<any, TrimAudioRequestPayload>(
  'trim/trimAudio', 
  async ({form, params}) => {
    const response = await ApiHelper.postForDownload('/trim', form, params )
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

export const { audioMetadatasCleared, audioMetadatasUpdated, audioMetadataRemoved } = trimSlice.actions;

const trimReducer = trimSlice.reducer;
export default trimReducer


