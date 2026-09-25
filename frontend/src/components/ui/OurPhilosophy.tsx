import { useEffect, useRef, useState } from "react";
import styles from "../../styles/OurPhilosophy.module.css";

export default function OurPhilosophy() {
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
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="philosophy-heading"
    >
      <div className={styles.inner}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          <span className={styles.eyebrow}>What We Believe</span>
        </div>

        <h2 id="philosophy-heading" className={styles.heading}>
          Every Cut Tells a Story.
        </h2>

        <p className={styles.paragraph}>
          A great cut is more than technique — it's confidence you carry
          out the door. We take the time to understand your style, your
          day, and the version of yourself you want to show up as, then
          deliver a finish that speaks for itself.
        </p>
      </div>
    </section>
  );
}