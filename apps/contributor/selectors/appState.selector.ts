import { StoreState } from "@/store/store";

export function getState(state: StoreState) {
  return state.app;
}

export function getPtsHistory(state: StoreState) {
  return state.app?.ptsHistory;
}

export function getEvalHistory(state: StoreState) {
  return state.app?.evalHistory;
}