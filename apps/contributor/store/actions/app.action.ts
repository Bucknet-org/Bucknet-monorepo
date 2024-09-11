import { PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'redux'
import * as actionConstant from './action.constant'
import { EvalHistoryType, PtsHistoryType } from '../reducers/app.reducer'

export function updateEpoch(epoch: number): PayloadAction<number> {
  return {
    type: actionConstant.UPDATE_EPOCH,
    payload: epoch,
  }
}

export function updateWVS(wvs: any): PayloadAction<any> {
  return {
    type: actionConstant.UPDATE_WVS,
    payload: wvs,
  }
}

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