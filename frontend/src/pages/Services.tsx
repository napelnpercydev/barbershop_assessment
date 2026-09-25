import { useEffect, useRef, useState} from "react";
import styles from "../styles/Services.module.css";
import BookingCTA from "../components/ui/BookingCta";
interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

interface ServiceCategory {
  title: string;
  services: Service[];
}

interface ServicesPageProps {
  /** Base path of the booking page. The selected service id is appended as a query param. */
  bookingBasePath?: string;
  /** Optional handler for SPA routers — if provided, default navigation is prevented. */
  onBookService?: (serviceId: string, serviceName: string) => void;
}

const CATEGORIES: ServiceCategory[] = [
  {
    title: "Haircuts",
    services: [
      {
        id: "classic-haircut",
        name: "Classic Haircut",
        description:
          "A timeless, tailored cut finished with a clean edge and styling.",
        price: "R120",
        duration: "30 min",
      },
      {
        id: "skin-fade",
        name: "Skin Fade",
        description: "A precision fade blended flawlessly from skin to length.",
        price: "R160",
        duration: "45 min",
      },
      {
        id: "kids-haircut",
        name: "Kids Haircut",
        description:
          "A patient, sharp cut for the next generation. 12 & under.",
        price: "R100",
        duration: "30 min",
      },
      {
        id: "line-up-edge",
        name: "Line-Up & Edge",
        description:
          "A crisp hairline and edge refresh to hold you over between cuts.",
        price: "R60",
        duration: "15 min",
      },
    ],
  },
  {
    title: "Beard & Shave",
    services: [
      {
        id: "beard-trim",
        name: "Beard Trim",
        description:
          "Shaped and defined with precision clipper and razor work.",
        price: "R80",
        duration: "20 min",
      },
      {
        id: "beard-sculpt",
        name: "Beard Sculpt & Design",
        description: "Detailed shaping for a defined, intentional beard line.",
        price: "R110",
        duration: "30 min",
      },
      {
        id: "hot-towel-shave",
        name: "Hot Towel Shave",
        description:
          "A traditional straight-razor shave with hot towel preparation.",
        price: "R150",
        duration: "40 min",
      },
    ],
  },
  {
    title: "Complete & Premium",
    services: [
      {
        id: "haircut-beard",
        name: "Haircut & Beard",
        description:
          "Our signature combination — a full cut paired with beard shaping.",
        price: "R200",
        duration: "60 min",
      },
      {
        id: "scalp-hair-ritual",
        name: "Scalp & Hair Ritual",
        description:
          "A restorative scalp treatment with massage and conditioning.",
        price: "R190",
        duration: "50 min",
      },
      {
        id: "premium-grooming",
        name: "Premium Grooming",
        description:
          "The complete experience — cut, beard, hot towel shave and scalp treatment.",
        price: "R280",
        duration: "75 min",
      },
    ],
  },
];

export default function ServicesPage({}: ServicesPageProps) {
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

  // const handleBook = (
  //   event: MouseEvent<HTMLAnchorElement>,
  //   service: Service,
  // ) => {
  //   if (onBookService) {
  //     event.preventDefault();
  //     onBookService(service.id, service.name);
  //   }
  // };

  let rowIndex = 0;

  return (
    <>
      {" "}
      <main className={styles.page}>
        <section className={styles.intro}>
          <h1 className={styles.heading}>Our Services</h1>
          <span className={styles.headingRule} aria-hidden="true" />
          <p className={styles.introText}>
            Every service is carried out with the same attention to detail —
            precise technique, unhurried pacing, and a finish you'll notice for
            weeks after you leave the chair.
          </p>
        </section>

        <section
          ref={sectionRef}
          className={`${styles.menu} ${visible ? styles.visible : ""}`}
          aria-label="Service menu"
        >
          {CATEGORIES.map((category) => (
            <div key={category.title} className={styles.category}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <span className={styles.categoryRule} aria-hidden="true" />
              </div>

              <ul className={styles.serviceList}>
                {category.services.map((service) => {
                  const delay = Math.min(rowIndex * 0.06, 0.48);
                  rowIndex += 1;

                  return (
                    <li
                      key={service.id}
                      className={styles.serviceRow}
                      style={{ transitionDelay: `${delay}s` }}
                    >
                      <div className={styles.serviceInfo}>
                        <h3 className={styles.serviceName}>{service.name}</h3>
                        <p className={styles.serviceDescription}>
                          {service.description}
                        </p>
                      </div>

                      <div className={styles.serviceMeta}>
                        <span className={styles.duration}>
                          {service.duration}
                        </span>
                        <span className={styles.price}>{service.price}</span>
                        {/* <a
                          href={`${bookingBasePath}?service=${service.id}`}
                          className={styles.bookButton}
                          aria-label={`Book ${service.name}`}
                          onClick={(event) => handleBook(event, service)}
                        >
                          Book Now
                        </a> */}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      </main>
      <BookingCTA />
    </>
  );
}
