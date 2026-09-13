import type { SVGProps } from "react";

// Ícones em SVG inline (traço 2px), para não depender de fonte de ícones nem de glifos unicode.
const paths = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4",
  plus: "M12 5v14M5 12h14",
  download: "M12 4v12m0 0 4-4m-4 4-4-4M4 20h16",
  pencil: "M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z",
  bell: "M6 17V11a6 6 0 1 1 12 0v6l2 2H4l2-2Zm4 4h4",
  note: "M4 5h9M4 9h6M4 13h4m6-1 2 2 6-6M3 3h18v18H3z",
  info: "M12 8h.01M11 12h1v4h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  exit: "M9 4H5v16h4m6-4 4-4-4-4m4 4H10",
  pin: "M9 4h6l-1 6 3 3v2H7v-2l3-3-1-6Zm3 11v5",
  check: "M5 12l4 4 10-10",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2",
  chevron: "M6 9l6 6 6-6",
  camera: "M4 8h3l1.5-2h7L17 8h3v11H4V8Zm8 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  box: "M3 8.5 12 4l9 4.5V17L12 21l-9-4L3 8.5Zm0 0 9 4.5m0 0 9-4.5m-9 4.5V21",
  chip: "M8 8h8v8H8V8ZM4 9h1m-1 3h1m-1 3h1m14-6h1m-1 3h1m-1 3h1M9 4v1m3-1v1m3-1v1M9 19v1m3-1v1m3-1v1M5 5h14v14H5V5Z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      width="1em"
      height="1em"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
