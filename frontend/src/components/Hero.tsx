import { useEffect, useState } from "react";
import styles from "../styles/Hero.module.css";
import desktop from "../assets/hero.png";
import mobile from "../assets/hero-mobile.png";
import ImageCards from "./ui/ImageCards";
import one from "../assets/one.png";
import two from "../assets/two.png";
import three from "../assets/three.png";
import four from "../assets/four.png";
import { useNavigate } from "react-router-dom";
interface HeroProps {
  /** Path to the primary hero photograph. Replace with your own asset. */
  imageAlt?: string;
  onBookClick?: () => void;
}

export default function Hero({
  imageAlt = "Barber shaping a client's fade with clippers under warm studio light",
}: HeroProps) {
  const [img, setImg] = useState(window.innerWidth <= 768 ? mobile : desktop);

  useEffect(() => {
    const handleResize = () => {
      setImg(window.innerWidth <= 768 ? mobile : desktop);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const handleBook = () => {
    navigate("/appointment-booking");
  };
  return (
    <>
      <section className={styles.hero} aria-label="Introduction">
        <div className={styles.media}>
          <img
            src={img}
            alt={imageAlt}
            className={styles.image}
            fetchPriority="high"
          />
          <div className={styles.gradient} aria-hidden="true" />
          <div className={styles.tint} aria-hidden="true" />
        </div>

        <div className={styles.content}>
          <span className={styles.rule} aria-hidden="true" />

          <h1 className={styles.headline}>
            <span className={styles.line}>
              <span className={styles.lineInner}>Where precision</span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner}>meets craft.</span>
            </span>
          </h1>

          <p className={styles.subtext}>
            Modern cuts, classic technique. Book your next appointment in under
            a minute.
          </p>

          <button type="button" className={styles.cta} onClick={handleBook}>
            Book Appointment
          </button>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollLine} />
        </div>
      </section>
      <ImageCards
        images={[
          {
            src: one,
            alt: "Barber carefully creating a precise fade on a client's haircut",
            caption: "The Craft",
          },
          {
            src: two,
            alt: "Client enjoying a relaxed grooming experience in a premium barbershop",
            caption: "The Experience",
          },
          {
            src: three,
            alt: "Professional barbering tools arranged on a barbershop workstation",
            caption: "The Details",
          },
          {
            src: four,
            alt: "Confident client showcasing a freshly finished haircut",
            caption: "The Finish",
          },
        ]}
      />
    </>
  );
}
