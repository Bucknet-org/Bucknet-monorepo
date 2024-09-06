import { PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'redux'
import * as actionConstant from './action.constant'

export function updateProvider(provider: any): PayloadAction<any> {
  return {
    type: actionConstant.UPDATE_PROVIDER,
    payload: provider,
  }
}