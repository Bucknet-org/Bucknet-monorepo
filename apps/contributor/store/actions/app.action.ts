import { PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'redux'
import * as actionConstant from './action.constant'
import { EvalHistoryType, PtsHistoryType } from '../reducers/app.reducer'

export function addNewPtsHistory(ptsHistory: PtsHistoryType): PayloadAction<PtsHistoryType> {
  return {
    type: actionConstant.ADD_NEW_PTS_HISTORY,
    payload: ptsHistory,
  }
}

export function addNewEvalHistory(evalHistory: EvalHistoryType): PayloadAction<EvalHistoryType> {
  return {
    type: actionConstant.ADD_NEW_EVAL_HISTORY,
    payload: evalHistory,
  }
}