import { AnyAction } from 'redux'
import * as actionConstant from '../actions/action.constant'

interface AppState {
  currentEpoch: number
  wvs: any
  ptsHistory: Array<PtsHistoryType>
  evalHistory: Array<EvalHistoryType>
}


const initialState: AppState = {
  currentEpoch: 0,
  wvs: {},
  ptsHistory: [],
  evalHistory: []
}

export interface PtsHistoryType {
  epoch: number
  timestamp: number
  txHash: string
  avgPoints: string
  valWorks: any
}

export interface EvalHistoryType {
  epoch: number
  timestamp: number
  txHash: string
  wvs: any
}

export default function appReducer(state: AppState, action: AnyAction): AppState {
  const appState: AppState = {
    ...initialState,
    ...state,
  }
  switch (action.type) {
    case actionConstant.UPDATE_EPOCH:
      return {
        ...appState,
        currentEpoch: action.payload,
      }

    case actionConstant.UPDATE_WVS:
      return {
        ...appState,
        wvs: action.payload,
      }

    case actionConstant.ADD_NEW_EVAL_HISTORY:
      return {
        ...appState,
        evalHistory: [...appState.evalHistory, action.payload],
      }
    
    case actionConstant.ADD_NEW_PTS_HISTORY:
      return {
        ...appState,
        ptsHistory: [...appState.ptsHistory, action.payload],
      }

    default:
      return appState
  }
}
