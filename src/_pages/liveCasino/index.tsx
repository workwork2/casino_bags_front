import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import GameNavigation from "@/components/GameNavigation/GameNavigation";
import CategoryGrid from "@/components/CategoryGrid/CategoryGrid";
import { liveGamesData, LiveGame } from "@/data/live-games";

export default function LiveCasinoPage() {
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
          title="Live Shows"
          games={liveGamesData.filter((g: LiveGame) => g.type === "show")}
        />
      </div>
      <div className="container">
        <CategoryGrid
          title="Roulette"
          games={liveGamesData.filter((g: LiveGame) => g.type === "roulette")}
        />
      </div>
      <div className="container">
        <CategoryGrid
          title="Blackjack"
          games={liveGamesData.filter((g: LiveGame) => g.type === "blackjack")}
        />
      </div>

      <div className="container">
        <CategoryGrid
          title="Poker"
          games={liveGamesData.filter((g: LiveGame) => g.type === "poker")}
          isLastSection
        />
      </div>
    </>
  );
}
