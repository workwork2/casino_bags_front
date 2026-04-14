"use client";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import GameNavigation from "@/components/GameNavigation/GameNavigation";
import Stages from "@/components/Stages/Stages";
import NewsPage from "@/components/CarouselNews/CarouselNews";
import SlotsCarousel from "@/components/SlotsCarousel/SlotsCarousel";
import RecentWinnings from "@/components/RecentWinnings/RecentWinnings";
import { useAppDispatch } from "@/shared/lib/redux/hooks";
import { useEffect, useState } from "react";
import { fetchMe } from "@/features/auth/model/authSlice";
import { api } from "@/shared/lib/api/axios";

export default function Home() {
  const dispatch = useAppDispatch();

  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get("games/list").then((res) => {
      const raw = res.data;
      const flat = Object.values(raw).flat();
      setGames(flat);
    });
  }, []);

  useEffect(() => {
    dispatch(fetchMe());
  }, []);

  return (
    <>
      {/* <div className="container">
      <HeaderUpGetbonus/>
    </div> */}

      <div className="container">
        <ImageCarousel />
      </div>

      <div className="container">
        <GameNavigation />
      </div>

      <div className="container">
        <SlotsCarousel games={games} />
      </div>
      <div className="container">
        <Stages />
      </div>

      <div className="container">
        <NewsPage />
      </div>

      <div className="container">
        <RecentWinnings />
      </div>
    </>
  );
}
