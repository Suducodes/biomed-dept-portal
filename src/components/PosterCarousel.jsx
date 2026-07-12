import { useEffect, useState } from "react";

// Auto-advancing poster/image carousel. `items` = [{ src, title, caption }].
export default function PosterCarousel({ items = [], interval = 5000 }) {
  const [i, setI] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), interval);
    return () => clearInterval(t);
  }, [n, interval]);

  if (n === 0) {
    return (
      <div className="glass grid aspect-[16/10] place-items-center text-sm text-[var(--color-mist)]">
        No posters yet
      </div>
    );
  }

  const item = items[i];
  return (
    <div className="glass group relative overflow-hidden">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          key={item.src}
          src={item.src}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
        <p className="text-sm font-semibold text-white">{item.title}</p>
        {item.caption && <p className="text-xs text-white/70">{item.caption}</p>}
      </div>
      {n > 1 && (
        <div className="absolute right-3 top-3 flex gap-1.5">
          {items.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Slide ${k + 1}`}
              className={
                "h-1.5 rounded-full transition-all " +
                (k === i ? "w-5 bg-[var(--color-signal)]" : "w-1.5 bg-white/40")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
