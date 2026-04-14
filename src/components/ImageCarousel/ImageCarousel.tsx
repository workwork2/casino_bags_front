"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useAuthModal } from "@/components/AuthModal/provider/AuthModalProvider";
import { useAppSelector } from "@/shared/lib/redux/hooks";
import RotatingTypewriter from "./RotatingTypewriter";
import classes from "./ImageCarousel.module.scss";

type SlideItem = {
  id: number;
  src: string;
  alt: string;
  title: string;
  rotatingPhrases: string[];
  description: string;
  primaryText: string;
  primaryHref?: string;
  secondaryText: string;
  secondaryHref?: string;
};

/** Гость — как в хедере: основная кнопка = Sign up, вторая = Log in */
const guestSlides: SlideItem[] = [
  {
    id: 1,
    src: "/hero-banner-v2.png",
    alt: "Онлайн-казино: бонусы и слоты",
    title: "Крути — забирай",
    rotatingPhrases: [
      "Депозитный бонус на старт",
      "Пакет фриспинов каждый день",
      "Кэшбек без лишней бумаги",
      "Reload, который чувствуется",
    ],
    description: "Топ-слоты, live и турниры в одном аккаунте. Регистрация за минуту — и ты в игре.",
    primaryText: "Регистрация",
    secondaryText: "Войти",
  },
  {
    id: 2,
    src: "/hero-banner-v2.png",
    alt: "Слоты, рулетка и live-столы",
    title: "Слоты и live без пауз",
    rotatingPhrases: [
      "Megaways на полную",
      "Live-рулетка 24/7",
      "Турниры с призами",
      "Провайдеры мирового уровня",
    ],
    description: "Крути где угодно — прогресс и баланс всегда с тобой, с телефона или ПК.",
    primaryText: "К бонусам",
    primaryHref: "/bonuses",
    secondaryText: "В слоты",
    secondaryHref: "/slots",
  },
  {
    id: 3,
    src: "/hero-banner-v2.png",
    alt: "VIP и программа лояльности",
    title: "Статус растёт с каждой ставкой",
    rotatingPhrases: [
      "Персональные подарки",
      "Закрытые ивенты",
      "Повышенный кэшбек",
      "Приоритет на вывод",
    ],
    description: "Проходи уровни и забирай награды за активность — без пустых обещаний.",
    primaryText: "Лояльность",
    primaryHref: "/loyalty",
    secondaryText: "FAQ",
    secondaryHref: "/faq",
  },
];

const playerSlides: SlideItem[] = [
  {
    id: 1,
    src: "/hero-banner-v2.png",
    alt: "Бонусы казино и кэшбек",
    title: "Твои бонусы уже ждут",
    rotatingPhrases: [
      "Кэшбек недели внутри",
      "Депозитный бонус активен",
      "Персональный reload",
      "Фриспины на любимые слоты",
    ],
    description: "Пополняй счёт и забирай офферы — всё подсвечено, ничего не пропустишь.",
    primaryText: "Бонусы",
    primaryHref: "/bonuses",
    secondaryText: "Депозит",
    secondaryHref: "/deposit",
  },
  {
    id: 2,
    src: "/hero-banner-v2.png",
    alt: "Турниры и гонка за призами",
    title: "Гонка за призами",
    rotatingPhrases: [
      "Турниры каждую неделю",
      "Лидерборд в реальном времени",
      "Live-арена",
      "Буст множителей",
    ],
    description: "Поднимайся в таблице и забирай дополнительные награды за активность.",
    primaryText: "Турниры",
    primaryHref: "/tournaments",
    secondaryText: "Live",
    secondaryHref: "/live-casino",
  },
  {
    id: 3,
    src: "/hero-banner-v2.png",
    alt: "VIP-статус в казино",
    title: "VIP — это про тебя",
    rotatingPhrases: [
      "Рост статуса онлайн",
      "Закрытые предложения",
      "Приоритет на выплаты",
      "История наград в одном месте",
    ],
    description: "Следи за прогрессом и открывай привилегии, которые заметны сразу.",
    primaryText: "Лояльность",
    primaryHref: "/loyalty",
    secondaryText: "Аккаунт",
    secondaryHref: "/account",
  },
];

export default function ImageCarousel() {
  const { openLogin, openSignup } = useAuthModal();
  const user = useAppSelector((s) => s.user.user);
  const slidesData = user ? playerSlides : guestSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 6500, stopOnInteraction: false })],
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
                    sizes="(max-width: 640px) 100vw, min(1200px, 100vw)"
                    quality={92}
                    priority={slide.id === 1}
                  />
                </div>
                <div className={classes.overlay} aria-hidden />
                <div className={classes.content}>
                  <div className={classes.contentRow}>
                    <div className={classes.copyCol}>
                      <h2 className={classes.title}>{slide.title}</h2>
                      <RotatingTypewriter key={slide.id} phrases={slide.rotatingPhrases} />
                      <p className={classes.description}>{slide.description}</p>
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
            aria-label={`Слайд ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
