export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-slide-in rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-card"
    >
      {message}
    </div>
  );
}
