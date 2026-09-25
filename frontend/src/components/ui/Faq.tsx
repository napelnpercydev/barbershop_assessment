import { useEffect, useRef, useState } from "react";
import styles from "../../styles/FAQ.module.css";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "booking",
    question: "Do I need to book an appointment in advance?",
    answer:
      "We recommend booking ahead to guarantee your preferred barber and time slot, especially on weekends. Walk-ins are welcome whenever a chair is free.",
  },
  {
    id: "cancellation",
    question: "What is your cancellation policy?",
    answer:
      "We ask for at least 4 hours' notice if you need to cancel or reschedule, so we can offer the slot to another client. Late cancellations may be subject to a fee.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept card, cash and all major mobile payment options. Payment is taken at the end of your appointment.",
  },
  {
    id: "kids",
    question: "Do you cut children's hair?",
    answer:
      "Yes — our barbers are happy to work with clients of all ages. See our Kids Haircut service for details and pricing.",
  },
  {
    id: "products",
    question: "Do you sell the grooming products you use?",
    answer:
      "Most of our styling and beard products are available to purchase in-shop, so you can maintain your look between visits.",
  },
];

export default function FAQ({ items = DEFAULT_FAQS }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
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
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${visible ? styles.visible : ""}`}
      aria-labelledby="faq-heading"
    >
      <div className={styles.header}>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          <span className={styles.eyebrow}>FAQ</span>
        </div>
        <h2 id="faq-heading" className={styles.heading}>
          Frequently Asked Questions
        </h2>
      </div>

      <ul className={styles.list}>
        {items.map((item, index) => {
          const isOpen = openId === item.id;
          const panelId = `faq-panel-${item.id}`;
          const buttonId = `faq-button-${item.id}`;

          return (
            <li
              key={item.id}
              className={styles.item}
              style={{ transitionDelay: `${Math.min(index * 0.06, 0.4)}s` }}
            >
              <h3 className={styles.questionRow}>
                <button
                  id={buttonId}
                  type="button"
                  className={styles.questionButton}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <span
                    className={`${styles.icon} ${
                      isOpen ? styles.iconOpen : ""
                    }`}
                    aria-hidden="true"
                  >
                    <span className={styles.iconBarVertical} />
                    <span className={styles.iconBarHorizontal} />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`${styles.panelWrapper} ${
                  isOpen ? styles.panelWrapperOpen : ""
                }`}
              >
                <div className={styles.panelInner}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}