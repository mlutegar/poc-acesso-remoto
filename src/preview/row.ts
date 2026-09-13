import { normalize } from "../operations/model";

/** Uma linha de listagem nas telas ainda não ligadas aos dados. */
export type PreviewRow = {
  tab: string;
  photo?: string;
  kind?: "pessoa" | "objeto";
  main: string[];
  cols: string[];
  badge?: [string, string];
  actions?: string[];
};

export const matches = (row: PreviewRow, query: string) =>
  normalize([...row.main, ...row.cols, row.badge?.[0] ?? ""].join(" ")).includes(normalize(query));

export const AVISO = "Nesta prévia esta ação ainda não está ligada aos dados.";
