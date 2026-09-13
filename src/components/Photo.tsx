import { Icon } from "./Icons";

/** Iniciais para o espaço de foto, a partir do nome. */
export function initials(name: string) {
  const limpo = name.trim();
  // Rótulo já abreviado ("CM") passa direto; nome completo vira duas iniciais.
  if (limpo.length <= 3 && !limpo.includes(" ")) return limpo.toUpperCase();
  const partes = limpo.split(/\s+/).filter((p) => p.length > 2);
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase() || "?";
}

/**
 * Espaço reservado para a foto. O sistema de referência mostra foto do
 * visitante, do morador e até da encomenda; aqui o quadro fica no mesmo lugar
 * e tamanho, sem armazenar imagem — em localStorage, foto em base64 estoura a
 * cota do navegador.
 */
export function Photo({
  name,
  kind = "pessoa",
  tone = "",
}: {
  name?: string;
  kind?: "pessoa" | "objeto";
  tone?: string;
}) {
  return (
    <span
      className={`sh-photo ${tone}`}
      role="img"
      aria-label={`Espaço reservado para foto${name ? ` de ${name}` : ""}`}
      title="Espaço reservado para foto"
    >
      {kind === "objeto" ? <Icon name="box" className="sh-photo-glyph" /> : initials(name || "")}
      <span className="sh-photo-badge" aria-hidden>
        <Icon name="camera" />
      </span>
    </span>
  );
}

/** Quadro de foto dentro dos formulários, como no cadastro do original. */
export function PhotoField({
  label = "Foto",
  kind = "pessoa",
}: {
  label?: string;
  kind?: "pessoa" | "objeto";
}) {
  return (
    <div className="sh-photo-field">
      <span className="sh-photo-field-label">{label}</span>
      <span className="sh-photo lg" role="img" aria-label="Espaço reservado para foto">
        {kind === "objeto" ? (
          <Icon name="box" className="sh-photo-glyph" />
        ) : (
          <Icon name="camera" className="sh-photo-glyph" />
        )}
      </span>
      <div className="sh-photo-actions">
        <button type="button" className="op-button" disabled>
          Câmera
        </button>
        <button type="button" className="op-button" disabled>
          Arquivo
        </button>
      </div>
      <small>Sem imagem nesta fase</small>
    </div>
  );
}
