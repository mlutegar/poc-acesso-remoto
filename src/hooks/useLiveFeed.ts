import { useEffect, useRef, useState } from "react";
import { accessEvents, liveFeedPool, type AccessEvent } from "../data/mock";

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Simula um feed de acesso em tempo real: injeta um novo evento a cada `intervalMs`.
 * Retorna a lista (mais recentes primeiro) e um sinalizador do último item para animar.
 */
export function useLiveFeed(intervalMs = 4000, max = 20) {
  const [events, setEvents] = useState<AccessEvent[]>(accessEvents);
  const [paused, setPaused] = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      counter.current += 1;
      const template = liveFeedPool[counter.current % liveFeedPool.length];
      const next: AccessEvent = {
        ...template,
        id: `live-${counter.current}`,
        time: nowHHMM(),
      };
      setEvents((prev) => [next, ...prev].slice(0, max));
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, max, paused]);

  return { events, paused, setPaused };
}
