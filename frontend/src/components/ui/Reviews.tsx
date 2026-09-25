import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import styles from "../../styles/Reviews.module.css";

interface Review {
  id: string;
  name: string;
  /** 1–5 */
  rating: number;
  quote: string;
}

interface ReviewsProps {
  reviews?: Review[];
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "David M.",
    rating: 5,
    quote:
      "Best fade I've had in years. The attention to detail is next level, and the shop itself feels premium from the moment you walk in.",
  },
  {
    id: "r2",
    name: "Karabo S.",
    rating: 4,
    quote:
      "My barber actually listens. I've never had to over-explain what I want — he just gets it right, every single time.",
  },
  {
    id: "r3",
    name: "Liam P.",
    rating: 5,
    quote:
      "The hot towel shave is worth it alone. Relaxing, precise, and I walked out looking sharper than I have in a long time.",
  },
];

export default function Reviews({ reviews = DEFAULT_REVIEWS }: ReviewsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="reviews-heading"
    >
      <div className={styles.header}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          <span className={styles.eyebrow}>Client Words</span>
        </div>
        <h2 id="reviews-heading" className={styles.heading}>
          What Our Clients Say
        </h2>
      </div>

      <ul className={styles.grid}>
        {reviews.map((review, index) => (
          <li
            key={review.id}
            className={styles.card}
            style={{ transitionDelay: `${Math.min(index * 0.1, 0.4)}s` }}
          >
            <span className={styles.cardRule} aria-hidden="true" />

            <div
              className={styles.stars}
              role="img"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={16}
                  strokeWidth={1.5}
                  color={
                    starIndex < review.rating
                      ? "var(--accent, #c9a45c)"
                      : "var(--border, #e4d8c2)"
                  }
                  fill={
                    starIndex < review.rating ? "var(--accent, #c9a45c)" : "none"
                  }
                  aria-hidden="true"
                />
              ))}
            </div>

            <p className={styles.quote}>&ldquo;{review.quote}&rdquo;</p>

            <span className={styles.name}>{review.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}