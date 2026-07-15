import HomeVaultBanner from "@/components/Banner";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";

import TopCategories from "@/components/TopCategories";

export default function Home() {
  return (
    <div>
      <HomeVaultBanner></HomeVaultBanner>
      <TopCategories></TopCategories>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <StatsSection></StatsSection>
      <FAQSection></FAQSection>
      <CTASection></CTASection>
    </div>
  );
}
