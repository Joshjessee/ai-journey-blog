"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, ZoomIn } from "lucide-react";
import { Lightbox } from "./Lightbox";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface SkyDivingGalleryProps {
  images: GalleryImage[];
}

export function SkyDivingGallery({ images }: SkyDivingGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [loadErrors, setLoadErrors] = useState<Set<number>>(new Set());

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setDirection(1);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setDirection(1);
    setLightboxIndex((i) => (i !== null ? Math.min(i + 1, images.length - 1) : null));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null));
  }, []);

  const handleImageError = (index: number) => {
    setLoadErrors((prev) => new Set(prev).add(index));
  };

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-accent-500/10 dark:bg-accent-500/20">
          <Wind className="w-6 h-6 text-accent-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Skydiving
        </h2>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
        Nothing resets the mind like freefall. I've been jumping for a few years
        — from belly flying to working on sit-fly. The sky is the one place where
        nothing else matters.
      </p>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => !loadErrors.has(index) && openLightbox(index)}
          >
            {loadErrors.has(index) ? (
              /* Placeholder when image file is missing */
              <div className="aspect-[3/4] flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                <Wind className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Photo coming soon
                </p>
              </div>
            ) : (
              <>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto block rounded-xl transition-transform duration-300 group-hover:brightness-90"
                  onError={() => handleImageError(index)}
                  draggable={false}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    <ZoomIn className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            direction={direction}
            onClose={closeLightbox}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
