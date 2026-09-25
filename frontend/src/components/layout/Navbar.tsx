import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "../../styles/Navbar.module.css";
import logo from "../../assets/logo.png";
interface NavLinkItem {
  label: string;
  to: string;
}

interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
  bookingHref?: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  // { label: "Barbers", to: "/barbers" },
  { label: "About", to: "/about-us" },
  { label: "Contact", to: "/contact-us" },
];

export default function Navbar({
  logoSrc = logo,
  logoAlt = "Crown & Craft",
  bookingHref = "/appointment-booking",
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Solid + shadow after a small scroll distance, transparent-ish glass at top.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on Escape.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Close automatically if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 960px)");
    const handleChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ""}`;

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${
        menuOpen ? styles.menuOpen : ""
      }`}
    >
      <div className={styles.bar}>
        <Link
          to="/"
          className={styles.logoLink}
          onClick={closeMenu}
          aria-label="Crown & Craft — Home"
        >
          <img src={logoSrc} alt={logoAlt} className={styles.logo} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={navLinkClass}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link
            to={bookingHref}
            className={styles.bookButton}
            onClick={closeMenu}
          >
            Book Appointment
          </Link>

          <button
            type="button"
            className={`${styles.menuToggle} ${
              menuOpen ? styles.toggleOpen : ""
            }`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className={styles.toggleBar} />
            <span className={styles.toggleBar} />
            <span className={styles.toggleBar} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={styles.mobileMenu}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul className={styles.mobileNavList}>
            {NAV_LINKS.map((link, index) => (
              <li
                key={link.to}
                className={styles.mobileNavItem}
                style={{
                  transitionDelay: menuOpen ? `${index * 0.05 + 0.1}s` : "0s",
                }}
              >
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={mobileNavLinkClass}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
