import { SiteHeader } from "@/components/shared/site-header";

import { EditorialHero } from "@/components/home/editorial-hero";
import { AtmosphereGallery } from "@/components/home/atmosphere-gallery";
import { Artisans } from "@/components/home/artisans";
import { ServiceMenu } from "@/components/home/service-menu";
import { Philosophy } from "@/components/home/philosophy";
import { ClosingCta } from "@/components/home/closing-cta";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />

      <EditorialHero />

      <AtmosphereGallery />

      <Artisans />

      <ServiceMenu />

      <Philosophy />

      <ClosingCta />
    </main>
  );
}