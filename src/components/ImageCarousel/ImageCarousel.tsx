"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useAuthModal } from "@/components/AuthModal/provider/AuthModalProvider";
import { useAppSelector } from "@/shared/lib/redux/hooks";
import classes from "./ImageCarousel.module.scss";

type SlideItem = {
  id: number;
  src: string;
  alt: string;
  badge: string;
  title: string;
  description: string;
  primaryText: string;
  primaryHref?: string;
  secondaryText: string;
  secondaryHref?: string;
};

/** Баннеры для гостя: CTA через модалку регистрации / входа */
const guestSlides: SlideItem[] = [
  {
    id: 1,
    src: "/promo-banner-winwave.png",
    alt: "Welcome bonus",
    badge: "Welcome",
    title: "Start strong with your first bonus",
    description:
      "Create an account and unlock welcome offers, slots, and live tables in one place.",
    primaryText: "Sign up",
    secondaryText: "Log in",
  },
  {
    id: 2,
    src: "/promo-banner-winwave.png",
    alt: "Slots and live casino",
    badge: "Hot games",
    title: "Slots, live tables, tournaments",
    description:
      "Play top providers and keep progress in one account on desktop and mobile.",
    primaryText: "Open bonuses",
    primaryHref: "/bonuses",
    secondaryText: "Explore slots",
    secondaryHref: "/slots",
  },
  {
    id: 3,
    src: "/promo-banner-winwave.png",
    alt: "Loyalty program",
    badge: "Loyalty",
    title: "Grow your status and rewards",
    description:
      "Complete stages, join events, and get better perks from your activity.",
    primaryText: "View loyalty",
    primaryHref: "/loyalty",
    secondaryText: "How to start",
    secondaryHref: "/faq",
  },
];

/** Баннеры для авторизованного игрока */
const playerSlides: SlideItem[] = [
  {
    id: 1,
    src: "/promo-banner-winwave.png",
    alt: "Weekly cashback",
    badge: "For you",
    title: "Weekly cashback is ready",
    description:
      "Open your rewards and keep the momentum with your current profile level.",
    primaryText: "View bonuses",
    primaryHref: "/bonuses",
    secondaryText: "Deposit",
    secondaryHref: "/deposit",
  },
  {
    id: 2,
    src: "/promo-banner-winwave.png",
    alt: "Tournaments and events",
    badge: "Events",
    title: "Join tournaments and prize races",
    description:
      "Compete with players, climb the leaderboard, and collect extra rewards.",
    primaryText: "Open tournaments",
    primaryHref: "/tournaments",
    secondaryText: "Live casino",
    secondaryHref: "/live-casino",
  },
  {
    id: 3,
    src: "/promo-banner-winwave.png",
    alt: "Loyalty status",
    badge: "VIP",
    title: "Boost status in loyalty program",
    description:
      "Track your progress and unlock bigger privileges for regular play.",
    primaryText: "Loyalty page",
    primaryHref: "/loyalty",
    secondaryText: "My account",
    secondaryHref: "/account",
  },
];

export default function ImageCarousel() {
  const { openLogin, openSignup } = useAuthModal();
  const user = useAppSelector((s) => s.user.user);
  const slidesData = user ? playerSlides : guestSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={classes.carousel} key={user ? "player" : "guest"}>
      <div className={classes.viewport} ref={emblaRef}>
        <div className={classes.carouselContainer}>
          {slidesData.map((slide) => (
            <div className={classes.slide} key={slide.id}>
              <div className={classes.imgContainer}>
                <div className={classes.media}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className={classes.bannerImage}
                    sizes="(max-width: 600px) 100vw, min(1200px, 100vw)"
                    quality={92}
                    priority={slide.id === 1}
                  />
                </div>
                <div className={classes.overlay} aria-hidden />
                <div className={classes.content}>
                  <div className={classes.textBlock}>
                    <span className={classes.badge}>{slide.badge}</span>
                    <h2 className={classes.title}>{slide.title}</h2>
                    <p className={classes.description}>{slide.description}</p>
                  </div>
                  <div className={classes.actions}>
                    {slide.primaryHref ? (
                      <Link href={slide.primaryHref} className={classes.primaryBtn}>
                        {slide.primaryText}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={classes.primaryBtn}
                        onClick={openSignup}
                      >
                        {slide.primaryText}
                      </button>
                    )}

                    {slide.secondaryHref ? (
                      <Link href={slide.secondaryHref} className={classes.secondaryBtn}>
                        {slide.secondaryText}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={classes.secondaryBtn}
                        onClick={openLogin}
                      >
                        {slide.secondaryText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={classes.indicators}>
        {slidesData.map((_, i) => (
          <button
            key={i}
            type="button"
            className={classes.indicator}
            data-active={selected === i ? true : undefined}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
