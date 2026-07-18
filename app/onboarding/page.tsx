import { OnboardingWizard } from "@/components/onboarding/wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding — Bento",
  description: "Set up your Bento account and discover hidden savings.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
