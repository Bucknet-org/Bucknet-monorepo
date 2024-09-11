import { StoreState } from "@/store/store";

export function getState(state: StoreState) {
  return state.app;
}

export function getCurrentEpoch(state: StoreState) {
  return state.app?.currentEpoch;
}

export function getWVS(state: StoreState) {
  return state.app?.wvs;
}

export function getPtsHistory(state: StoreState) {
  return state.app?.ptsHistory;
}

export function getEvalHistory(state: StoreState) {
  return state.app?.evalHistory;
}