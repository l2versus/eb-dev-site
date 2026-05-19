import { AboutServicesSection } from "@/components/sections/AboutServicesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { OfferSections } from "@/components/sections/OfferSections";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ScrollStorySystem } from "@/components/sections/ScrollStorySystem";
import { TrustProcessSections } from "@/components/sections/TrustProcessSections";
import { VideoStorySection } from "@/components/sections/VideoStorySection";
import { ScrollProgressBar } from "@/components/motion";
import PreloadOnScroll from "@/components/PreloadOnScroll";

export default function HomePage() {
  return (
    <>
      <PreloadOnScroll />
      <ScrollProgressBar />
      <HeroSection />
      <ScrollStorySystem />
      <VideoStorySection />
      <AboutServicesSection />
      <ProjectsSection />
      <TrustProcessSections />
      <OfferSections />
    </>
  );
}
