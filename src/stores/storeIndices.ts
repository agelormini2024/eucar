import { create } from "zustand"

type IndicesStore = {
  refresh: () => void
  setRefresh: (fn: () => void) => void
}

export const useIndicesStore = create<IndicesStore>((set) => ({
  refresh: () => {},
  setRefresh: (fn) => set({ refresh: fn }),
}))