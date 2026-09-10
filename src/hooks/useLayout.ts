import { useOutletContext } from "react-router-dom";

export interface LayoutContext {
  openMenu: () => void;
}

export function useLayout() {
  return useOutletContext<LayoutContext>();
}
