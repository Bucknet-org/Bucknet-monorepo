import { StoreEnhancer } from 'redux'
import { configureStore as baseConfigureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/root.reducer'

export default function configureStore(preloadedState: any) {
  return baseConfigureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
    devTools: true,
    preloadedState,
  })
}

type Store = ReturnType<typeof configureStore>

export type StoreState = ReturnType<Store['getState']>
export type StoreDispatch = Store['dispatch']
