import { useMemo, useState } from "react";
import styles from "../../styles/ImageCards.module.css";

export interface ImageCardItem {
  src: string;
  alt: string;
  /** Optional short label revealed on hover / selection, e.g. "The Fade Room". */
  caption?: string;
}

interface ImageCardsProps {
  /** Up to 4 images. Extra items beyond 4 are ignored. */
  images: ImageCardItem[];
  /** Seconds it takes a single image to cross the full track width. Lower = faster. */
  speed?: number;
}

export default function ImageCards({ images, speed = 7 }: ImageCardsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const items = useMemo(() => images.slice(0, 4), [images]);
  // Duplicate the set so the marquee can loop with no visible seam.
  const track = useMemo(() => [...items, ...items], [items]);

  const isPaused = selected !== null;
  const duration = `${Math.max(items.length, 1) * speed}s`;

  const handleSelect = (originalIndex: number) => {
    setSelected((current) => (current === originalIndex ? null : originalIndex));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") setSelected(null);
  };

  if (items.length === 0) return null;

  return (
    <div className={styles.viewport} onKeyDown={handleKeyDown}>
      <div
        className={styles.track}
        style={{
          animationDuration: duration,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {track.map((image, index) => {
          const originalIndex = index % items.length;
          const isDuplicate = index >= items.length;
          const isSelected = selected === originalIndex;
          const isDimmed = isPaused && !isSelected;

          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              className={[
                styles.card,
                isSelected ? styles.selected : "",
                isDimmed ? styles.dimmed : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleSelect(originalIndex)}
              aria-pressed={isSelected}
              aria-hidden={isDuplicate || undefined}
              tabIndex={isDuplicate ? -1 : 0}
              aria-label={
                image.caption ? `${image.alt} — ${image.caption}` : image.alt
              }
            >
              <img
                src={image.src}
                alt={image.alt}
                className={styles.image}
                draggable={false}
              />
              {image.caption && (
                <span className={styles.caption}>{image.caption}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}