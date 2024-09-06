import { StoreState } from "@/store/store";

export function getProvider(state: StoreState) {
  return state.app?.provider;
}