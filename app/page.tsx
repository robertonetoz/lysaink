import { About } from "@/components/About";
import { Bestiary } from "@/components/Bestiary";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { ThornDivider } from "@/components/Thorns";
import { getWorks } from "@/lib/gallery";

export default function Home() {
  const works = getWorks();

  return (
    <>
      <main>
        <Hero />
        <About />
        <Bestiary />
        <Gallery works={works} showSetupHint={process.env.NODE_ENV === "development"} />
        <ThornDivider seed={5} />
        <Process />
        <ThornDivider seed={12} />
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
