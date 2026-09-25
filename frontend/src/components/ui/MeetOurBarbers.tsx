import { useEffect, useRef, useState } from "react";
import styles from "../../styles/MeetOurBarbers.module.css";
import john from "../../assets/john.png";
import jake from "../../assets/jake.png";
import jamal from "../../assets/jamal.png";
import raj from "../../assets/raj.png";
export interface Barber {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  alt: string;
}

interface MeetOurBarbersProps {
  barbers?: Barber[];
}

const DEFAULT_BARBERS: Barber[] = [
  {
    id: "themba-nkosi",
    name: "Themba Nkosi",
    role: "Master Barber — Fades & Design",
    bio: "With over twelve years behind the chair, Themba brings unmatched precision to every fade. Clients come to him for sharp lines and even sharper detail.",
    photo: john,
    alt: "Portrait of barber Themba Nkosi",
  },
  {
    id: "julian-cross",
    name: "Julian Cross",
    role: "Senior Barber — Classic Cuts",
    bio: "Julian's approach blends old-school technique with a modern eye, specialising in timeless cuts that never go out of style.",
    photo: jake,
    alt: "Portrait of barber Julian Cross",
  },
  {
    id: "sipho-dlamini",
    name: "Sipho Dlamini",
    role: "Barber — Beard Specialist",
    bio: "Sipho has a gift for beard sculpting, shaping every client's facial hair to complement their features and personal style.",
    photo: jamal,
    alt: "Portrait of barber Sipho Dlamini",
  },
  {
    id: "marco-reyes",
    name: "Marco Reyes",
    role: "Barber — Skin Fades & Line Work",
    bio: "Known for his steady hand and eye for symmetry, Marco delivers crisp skin fades and clean line work every time.",
    photo: raj,
    alt: "Portrait of barber Marco Reyes",
  },
];

export default function MeetOurBarbers({
  barbers = DEFAULT_BARBERS,
}: MeetOurBarbersProps) {
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
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="barbers-heading"
    >
      <div className={styles.header}>
        <h2 id="barbers-heading" className={styles.heading}>
          The Hands Behind the Craft
        </h2>
        <p className={styles.supporting}>
          Every member of our team brings their own style and specialty, united
          by the same standard of care and precision.
        </p>
      </div>

      <ul className={styles.grid}>
        {barbers.map((barber, index) => (
          <li
            key={barber.id}
            className={styles.profile}
            style={{ transitionDelay: `${Math.min(index * 0.1, 0.4)}s` }}
          >
            <div className={styles.portraitWrap}>
              <img
                src={barber.photo}
                alt={barber.alt}
                className={styles.portrait}
              />
            </div>
            <h3 className={styles.name}>{barber.name}</h3>
            <p className={styles.role}>{barber.role}</p>
            <p className={styles.bio}>{barber.bio}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
