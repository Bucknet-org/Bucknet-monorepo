import { AnyAction } from 'redux'
import * as actionConstant from '../actions/action.constant'

interface AppState {
  provider: any
}

const initialState: AppState = {
  provider: {}
}

export default function appReducer(state: AppState, action: AnyAction): AppState {
  const appState: AppState = {
    ...initialState,
    ...state,
  }
  switch (action.type) {
    case actionConstant.UPDATE_PROVIDER:
      return {
        ...appState,
        provider: action.payload,
      }

    default:
      return appState
  }
}
