import { useEffect, useRef, useState } from "react";
import { MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react";
import styles from "../styles/LocationHours.module.css";

interface HourRow {
  day: string;
  time: string;
}

interface LocationHoursProps {
  address?: string;
  hours?: HourRow[];
  phone?: string;
  email?: string;
  directionsUrl?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const DEFAULT_HOURS: HourRow[] = [
  { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
  { day: "Saturday", time: "9:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export default function LocationHours({
  address = "142 Fenwick Street, Johannesburg",
  hours = DEFAULT_HOURS,
  phone = "+27 11 555 0182",
  email = "hello@thebarbershop.co",
  directionsUrl = "https://maps.google.com",
  imageSrc = "/images/shopfront.jpg",
  imageAlt = "Exterior of the barbershop storefront at dusk",
}: LocationHoursProps) {
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
      aria-labelledby="visit-heading"
    >
      <div className={styles.inner}>
        <div className={styles.info}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrow}>Visit Us</span>
          </div>

          <h2 id="visit-heading" className={styles.heading}>
            Find your seat.
          </h2>

          <ul className={styles.detailList}>
            <li className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <MapPin aria-hidden="true" strokeWidth={1.5} />
              </span>
              <div className={styles.detailContent}>
                <span className={styles.srOnly}>Address</span>
                <span className={styles.detailText}>{address}</span>
              </div>
            </li>

            <li className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <Clock aria-hidden="true" strokeWidth={1.5} />
              </span>
              <div className={styles.detailContent}>
                <span className={styles.srOnly}>Opening hours</span>
                <ul className={styles.hoursList}>
                  {hours.map((row) => (
                    <li key={row.day} className={styles.hoursItem}>
                      <span>{row.day}</span>
                      <span>{row.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <Phone aria-hidden="true" strokeWidth={1.5} />
              </span>
              <div className={styles.detailContent}>
                <span className={styles.srOnly}>Phone</span>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className={styles.detailLink}
                >
                  {phone}
                </a>
              </div>
            </li>

            <li className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <Mail aria-hidden="true" strokeWidth={1.5} />
              </span>
              <div className={styles.detailContent}>
                <span className={styles.srOnly}>Email</span>
                <a href={`mailto:${email}`} className={styles.detailLink}>
                  {email}
                </a>
              </div>
            </li>
          </ul>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsCta}
          >
            Get Directions
            <ExternalLink
              className={styles.directionsIcon}
              aria-hidden="true"
              strokeWidth={1.75}
            />
          </a>
        </div>

        <div className={styles.media}>
          <img src={imageSrc} alt={imageAlt} className={styles.image} />
        </div>
      </div>
    </section>
  );
}