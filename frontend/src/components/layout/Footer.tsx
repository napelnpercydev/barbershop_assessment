import { useState, type FormEvent, type JSX, type SVGProps } from "react";
import { Link } from "react-router-dom";
import InstagramIcon from "../ui/InstagramIcon";
import FacebookIcon from "../ui/FacebookIcon";
import XIcon from "../ui/xIcon";
import styles from "../../styles/Footer.module.css";

interface FooterNavLink {
  label: string;
  to: string;
}

interface FooterSocialLink {
  label: string;
  href: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

interface FooterProps {
  brandName?: string;
  tagline?: string;
  navLinks?: FooterNavLink[];
  socialLinks?: FooterSocialLink[];
  termsHref?: string;
  privacyHref?: string;
  onSubscribe?: (email: string) => Promise<void> | void;
}

const DEFAULT_NAV_LINKS: FooterNavLink[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about-us" },
  { label: "Contact", to: "/contact-us" },
];

const DEFAULT_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeStatus = "idle" | "loading" | "success" | "error";

export default function Footer({
  brandName = "Crown & Craft",
  tagline = "Modern grooming, timeless craft.",
  navLinks = DEFAULT_NAV_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  termsHref = "/terms-and-conditions",
  onSubscribe,
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      if (onSubscribe) {
        await onSubscribe(email.trim());
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandBlock}>
          <Link to="/" className={styles.brandName}>
            {brandName}
          </Link>
          <p className={styles.tagline}>{tagline}</p>

          <ul className={styles.socialList}>
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={label}
                >
                  <Icon strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.subscribeBlock}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            <span className={styles.eyebrow}>Stay Sharp</span>
          </div>
          <h2 className={styles.subscribeHeading}>
            Grooming tips, new services, and first access to booking slots.
          </h2>

          <form
            className={styles.subscribeForm}
            onSubmit={handleSubmit}
            noValidate
          >
            <label htmlFor="footer-email" className={styles.srOnly}>
              Email address
            </label>
            <div className={styles.inputRow}>
              <input
                id="footer-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className={styles.input}
                aria-invalid={status === "error"}
                aria-describedby={
                  status === "error" ? "footer-email-message" : undefined
                }
              />
              <button
                type="submit"
                className={styles.subscribeButton}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Joining…" : "Subscribe"}
              </button>
            </div>

            {status === "error" && (
              <p
                id="footer-email-message"
                className={styles.formMessageError}
                role="alert"
              >
                Please enter a valid email address.
              </p>
            )}
            {status === "success" && (
              <p
                id="footer-email-message"
                className={styles.formMessageSuccess}
                role="status"
              >
                You're on the list — welcome aboard.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.bottom}>
        <nav aria-label="Footer">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.legalBlock}>
          <ul className={styles.legalList}>
            <li>
              <Link to={termsHref} className={styles.legalLink}>
                Terms &amp; Conditions
              </Link>
            </li>
            {/* <li>
              <Link to={privacyHref} className={styles.legalLink}>
                Privacy Policy
              </Link>
            </li> */}
          </ul>

          <p className={styles.copyright}>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
