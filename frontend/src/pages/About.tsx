import OurStory from "../components/ui/OurStory";
import OurPhilosophy from "../components/ui/OurPhilosophy";
import MeetOurBarbers, { type Barber } from "../components/ui/MeetOurBarbers";
import BookingCTA from "../components/ui/BookingCta";
// import BookingCTA from "../components/BookingCTA/BookingCTA";

interface AboutPageProps {
  storyImageSrc?: string;
  storyImageAlt?: string;
  barbers?: Barber[];
}

export default function About({
  storyImageSrc,
  storyImageAlt,
  barbers,
}: AboutPageProps) {
  return (
    <>
      <main>
        <OurStory imageSrc={storyImageSrc} imageAlt={storyImageAlt} />
        <OurPhilosophy />
        <MeetOurBarbers barbers={barbers} />
<BookingCTA />
      </main>
      {/* <BookingCTA /> */}
    </>
  );
}
