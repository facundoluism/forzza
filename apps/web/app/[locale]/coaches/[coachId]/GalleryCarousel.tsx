"use client";

import { useState } from "react";

interface Props {
  images: string[];
}

export function GalleryCarousel({ images }: Props) {
  const [idx, setIdx] = useState(0);

  if (!images.length) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#111]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[idx]}
        alt=""
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setIdx((i) => (i - 1 + images.length) % images.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Siguiente"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === idx ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
