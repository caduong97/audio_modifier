import { configureStore } from '@reduxjs/toolkit'
import mergeReducer from './mergeSlice'
import trimReducer from './trimSlice'
import stereoToMonoReducer from './stereoToMonoSlice'

const store = configureStore({
  reducer: {
    merge: mergeReducer,
    trim: trimReducer,
    stereoToMono: stereoToMonoReducer
  }
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type ApiRequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected'