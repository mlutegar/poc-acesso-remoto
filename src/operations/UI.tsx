import { useEffect, useRef, type ReactNode } from "react";
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog ref={ref} className="op-dialog" onCancel={onClose} aria-labelledby="dialog-title">
      <div className="op-dialog-head">
        <div>
          <h2 id="dialog-title">{title}</h2>
        </div>
        <button type="button" className="op-icon" onClick={onClose} aria-label="Fechar janela">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Field({
  label,
  name,
  value = "",
  type = "text",
  required = false,
  children,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}) {
  return (
    <label className="op-field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children ? (
        <select name={name} defaultValue={value} required={required}>
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea name={name} defaultValue={value} rows={3} maxLength={2000} />
      ) : (
        <input name={name} type={type} defaultValue={value} required={required} maxLength={200} />
      )}
    </label>
  );
}
export function Check({ label, name, checked }: { label: string; name: string; checked: boolean }) {
  return (
    <label className="op-check">
      <input type="checkbox" name={name} defaultChecked={checked} />
      {label}
    </label>
  );
}
export function Empty({ text }: { text: string }) {
  return (
    <div className="op-empty">
      <h3>Nenhum registro encontrado!</h3>
      <p>{text}</p>
    </div>
  );
}
export const formatDate = (s: string) =>
  s
    ? new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(s))
    : "—";
export function downloadCsv(filename: string, rows: string[][]) {
  const escape = (value: string) =>
    `"${(/^[\s]*[=+@\-\t\r]/.test(value) ? "'" : "") + value.replace(/"/g, '""')}"`;
  const blob = new Blob(["\uFEFF" + rows.map((row) => row.map(escape).join(";")).join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
