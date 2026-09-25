import Hero from "../components/Hero";
import ImageCards from "../components/ui/ImageCards";
import CraftServices from "../components/CraftServices";

import FAQ from "../components/ui/Faq";
import Reviews from "../components/ui/Reviews";
import BookingCTA from "../components/ui/BookingCta";
export default function Home() {
  return (
    <>
      <Hero />
      
      <CraftServices />
      <Reviews />
      <FAQ />
      {/*      <LocationHours/> */}
      <BookingCTA />
    </>
  );
}
