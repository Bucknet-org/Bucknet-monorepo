import { AnyAction } from 'redux'
import * as actionConstant from '../actions/action.constant'

interface AppState {
  ptsHistory: Array<PtsHistoryType>
  evalHistory: Array<EvalHistoryType>
}


const initialState: AppState = {
  ptsHistory: [],
  evalHistory: []
}

export interface PtsHistoryType {
  timestamp: number
  txHash: string
  avgPoints: string
  valWorks: any
}

export interface EvalHistoryType {
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
