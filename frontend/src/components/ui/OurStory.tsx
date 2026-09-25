import { useEffect, useRef, useState } from "react";
import styles from "../../styles/OurStory.module.css";
import imageSrc from "../../assets/about.png";
interface OurStoryProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function OurStory({
   
  imageAlt = "Barber and client sharing a laugh mid-cut in the shop",
}: OurStoryProps) {
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
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="story-heading"
    >
      <div className={styles.inner}>
        <div className={styles.text}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrow}>Our Story</span>
          </div>

          <h2 id="story-heading" className={styles.heading}>
            More Than Just a Haircut.
          </h2>

          <p className={styles.paragraph}>
            The Barbershop opened its doors with a simple idea: grooming
            should feel considered, not rushed. Every chair, every tool,
            every conversation is part of an experience built around care
            and craftsmanship.
          </p>

          <p className={styles.paragraph}>
            Today, our barbers bring together classic technique and modern
            style, working with precision and patience to make sure you
            leave looking — and feeling — like the best version of
            yourself.
          </p>
        </div>

        <div className={styles.media}>
          <img src={imageSrc} alt={imageAlt} className={styles.image} />
        </div>
      </div>
    </section>
  );
}