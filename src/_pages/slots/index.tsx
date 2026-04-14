"use client";

import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import GameNavigation from "@/components/GameNavigation/GameNavigation";
import CategoryGrid from "@/components/CategoryGrid/CategoryGrid";
import { slotsData, SlotGame } from "@/data/slots";

export default function SlotsPage() {
  return (
    <>
      <div className="container">
        <ImageCarousel />
      </div>

      <div className="container">
        <GameNavigation />
      </div>

      <div className="container">
        <CategoryGrid
          title="Popular Slots"
          games={slotsData.filter((s: SlotGame) => !!s.isPopular)}
        />
      </div>

      <div className="container">
        <CategoryGrid
          title="New Releases"
          games={slotsData.filter((s: SlotGame) => !!s.isNew)}
        />
      </div>

      <div className="container">
        <CategoryGrid
          title="Bonus Buy"
          games={slotsData.filter((s: SlotGame) => s.category === "buy-bonus")}
        />
      </div>

      <div className="container">
        <CategoryGrid
          title="Megaways"
          games={slotsData.filter((s: SlotGame) => s.category === "megaways")}
          isLastSection
        />
      </div>
    </>
  );
}