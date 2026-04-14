"use client";

import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5"; // Иконка шестеренки
import styles from "./page.module.scss";

import InfoModal from "@/components/InfoModal/InfoModal";

// --- Компонент Toggle ---
interface ToggleProps {
  title: string;
  desc?: string;
  isChecked: boolean;
  onChange: () => void;
  onInfoClick: () => void;
}

const ToggleItem = ({
  title,
  desc,
  isChecked,
  onChange,
  onInfoClick,
}: ToggleProps) => (
  <div className={styles.toggleRow}>
    <div className={styles.toggleLeft}>
      <div className={styles.titleWithIcon}>
        <h3 onClick={onChange}>{title}</h3>
        <button
          className={styles.questionBadge}
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
        >
          ?
        </button>
      </div>
      {desc && <span onClick={onChange}>{desc}</span>}
    </div>
    <div
      className={`${styles.switch} ${isChecked ? styles.active : ""}`}
      onClick={onChange}
    >
      <div className={styles.slider}></div>
    </div>
  </div>
);

// --- Компонент Radio ---
interface RadioProps {
  label: string;
  value: string;
  selectedValue: string;
  onSelect: (val: string) => void;
}

const RadioItem = ({ label, value, selectedValue, onSelect }: RadioProps) => {
  const isActive = value === selectedValue;
  return (
    <div
      className={`${styles.radioRow} ${isActive ? styles.activeRow : ""}`}
      onClick={() => onSelect(value)}
    >
      <label>{label}</label>
      <div className={`${styles.radioCircle} ${isActive ? styles.active : ""}`}>
        {isActive && <div className={styles.radioDot}></div>}
      </div>
    </div>
  );
};

export default function PreferencePage() {
  const [settings, setSettings] = useState({
    stealthMode: false,
    hideStatistics: true,
    hideTournament: true,
    giveUpRains: false,
    emailOffers: true,
    fiatFormat: "comma-dot",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: "",
  });

  const openInfo = (title: string, content: string) => {
    setModal({ isOpen: true, title, content });
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormat = (val: string) => {
    setSettings((prev) => ({ ...prev, fiatFormat: val }));
  };

  return (
    <div className={styles.settingsPage}>
      <div className="container">
        
        {/* Главная обертка в стиле страницы "Все новости" */}
        <div className={styles.wrapper}>
          
          {/* Заголовок с иконкой */}
          <div className={styles.pageHeader}>
            <IoSettingsOutline className={styles.headerIcon} />
            <h1>Настройки</h1>
          </div>

          {/* Сетка карточек в 2 колонки */}
          <div className={styles.contentGrid}>
            
            {/* 1. Privacy */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Приватность</h2>
                <p>Настройки анонимности вашего аккаунта.</p>
              </div>
              <div className={styles.cardBody}>
                <ToggleItem
                  title="Активировать режим невидимки"
                  isChecked={settings.stealthMode}
                  onChange={() => handleToggle("stealthMode")}
                  onInfoClick={() =>
                    openInfo(
                      "Режим невидимки",
                      "Ваше имя пользователя не будет отображаться в публичной истории ставок."
                    )
                  }
                />
                <ToggleItem
                  title="Скрыть всю статистику"
                  isChecked={settings.hideStatistics}
                  onChange={() => handleToggle("hideStatistics")}
                  onInfoClick={() =>
                    openInfo(
                      "Статистика",
                      "Только вы сможете видеть свою статистику прибыли, убытков и оборота."
                    )
                  }
                />
                <ToggleItem
                  title="Скрыть статистику турниров"
                  isChecked={settings.hideTournament}
                  onChange={() => handleToggle("hideTournament")}
                  onInfoClick={() =>
                    openInfo(
                      "Турниры",
                      "Другие пользователи не увидят ваш текущий счет и ранг в активных турнирах."
                    )
                  }
                />
              </div>
            </section>

            {/* 2. Community */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Сообщество</h2>
                <p>Управление чатом и социальными функциями.</p>
              </div>
              <div className={styles.cardBody}>
                <ToggleItem
                  title="Отказаться от дождей (Rains)"
                  isChecked={settings.giveUpRains}
                  onChange={() => handleToggle("giveUpRains")}
                  onInfoClick={() =>
                    openInfo(
                      "Дожди в чате",
                      "Включив это, вы будете исключены из случайных раздач криптовалюты в публичном чате."
                    )
                  }
                />
              </div>
            </section>

            {/* 3. Marketing */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Маркетинг</h2>
              </div>
              <div className={styles.cardBody}>
                <ToggleItem
                  title="Наши предложения на email"
                  isChecked={settings.emailOffers}
                  onChange={() => handleToggle("emailOffers")}
                  onInfoClick={() =>
                    openInfo(
                      "Email рассылка",
                      "Будьте в курсе персональных бонусов, еженедельных новостей и эксклюзивных ивентов."
                    )
                  }
                />
              </div>
            </section>

            {/* 4. Format */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Формат отображения валюты</h2>
              </div>
              <div className={styles.cardBody}>
                <RadioItem
                  label="123,456.78"
                  value="comma-dot"
                  selectedValue={settings.fiatFormat}
                  onSelect={handleFormat}
                />
                <RadioItem
                  label="١٢٣٬٤٥٦٫٧٨"
                  value="arabic"
                  selectedValue={settings.fiatFormat}
                  onSelect={handleFormat}
                />
                <RadioItem
                  label="123.456,78"
                  value="dot-comma"
                  selectedValue={settings.fiatFormat}
                  onSelect={handleFormat}
                />
              </div>
            </section>

          </div>
        </div>

        {/* Модальное окно */}
        <InfoModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
        >
          <p>{modal.content}</p>
        </InfoModal>

      </div>
    </div>
  );
}