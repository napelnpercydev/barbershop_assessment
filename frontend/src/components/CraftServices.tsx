import { Scissors, UserRound, Sparkles } from "lucide-react";
import styles from "../styles/CraftServices.module.css";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  { name: "Haircut", Icon: Scissors },
  { name: "Haircut + Beard", Icon: UserRound },
  { name: "Beard Grooming", Icon: Sparkles },
] as const;

export default function CraftServices() {
  const navigate = useNavigate();

  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  return (
    <section className={styles.section} aria-labelledby="craft-heading">
      <div className={styles.inner}>
        <div className={styles.statement}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrow}>The Craft</span>
          </div>

          <h2 id="craft-heading" className={styles.heading}>
            Precision in every cut. Confidence in every finish.
          </h2>

          <p className={styles.supporting}>
            We combine modern barbering with classic technique to create cuts
            that fit your style and leave you looking your best.
          </p>
        </div>

        <div className={styles.servicesCol}>
          <ul className={styles.serviceList}>
            {SERVICES.map(({ name, Icon }) => (
              <li key={name} className={styles.serviceItem}>
                <span className={styles.iconWrap}>
                  <Icon
                    className={styles.icon}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>

                <span className={styles.serviceName}>{name}</span>
              </li>
            ))}
          </ul>

          <div className={styles.ctaRow}>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={() => handleLinkClick("/appointment-booking")}
            >
              Book Now
            </button>

            <button
              type="button"
              className={styles.secondaryCta}
              onClick={() => handleLinkClick("/services")}
            >
              View All Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
