import { useEffect, useState } from "react";
import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import About from "./pages/About";
import Navbar from "./components/layout/Navbar";
import BookingForm from "./pages/Booking";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Footer from "./components/layout/Footer";
import ContactForm from "./pages/ContactForm";
import InfoModal from "./components/Modal";
import { Clock3 } from "lucide-react";
import TermsAndConditions from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ui/ScrollToTop";
function Layout() {
  return (
    <>
      <Navbar />
      <main className="main-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfoModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/appointment-booking" element={<BookingForm />} />
          <Route path="/contact-us" element={<ContactForm />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <InfoModal
        isOpen={showInfoModal}
        title="A quick note before you start"
        message="Our booking service may take a few extra seconds to respond when it hasn't been used recently. Once the service is awake, everything should respond normally."
        icon={<Clock3 size={28} />}
        buttonText="Got it"
        onClose={() => setShowInfoModal(false)}
      />
    </BrowserRouter>
  );
}
