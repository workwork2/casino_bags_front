"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./NotificationsDropdown.module.scss";
import {
  IoCloseOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { HEADER_ICON_SIZE } from "@/shared/config/navigation";
import { api } from "@/shared/lib/api/axios";

interface INotification {
  id: string; 
  icon: string;
  text: string;
  time: string;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(
          new CustomEvent("header-popover-open", {
            detail: { source: "notifications" },
          }),
        );
      }
      return next;
    });
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/games/notifications`,
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const closeOnOtherPopoverOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ source?: string }>;
      if (customEvent.detail?.source !== "notifications") {
        setIsOpen(false);
      }
    };

    window.addEventListener("header-popover-open", closeOnOtherPopoverOpen);
    return () =>
      window.removeEventListener(
        "header-popover-open",
        closeOnOtherPopoverOpen,
      );
  }, []);

  const removeNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.container}>
      {/* Кнопка колокольчика (Используем одну четкую иконку всегда!) */}
      <button className={styles.bellButton} type="button" onClick={toggleOpen}>
        <IoNotificationsOutline
          size={HEADER_ICON_SIZE}
          className={`${styles.bellGlyph} ${isOpen ? styles.active : ""}`}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Шапка меню */}
          <div className={styles.dropdownHeader}>
            <div className={styles.dropdownTitle}>
              <IoNotificationsOutline size={18} className={styles.titleIcon} />
              <span>Notifications</span>
            </div>
            <button
              className={styles.closeMainButton}
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Close notifications"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          {/* Список уведомлений */}
          <div className={styles.dropdownList}>
            {isLoading ? (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                No notifications yet
              </div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className={styles.notificationItem}>
                  {/* Иконка уведомления */}
                  <div className={styles.iconWrapper}>
                    <Image src={item.icon} alt="Icon" width={24} height={24} />
                  </div>

                  {/* Текст и время */}
                  <div className={styles.contentWrapper}>
                    <p className={styles.text}>{item.text}</p>
                    {item.time && (
                      <span className={styles.time}>{timeAgo(item.time)}</span>
                    )}
                  </div>

                  {/* Кнопка закрыть */}
                  <button
                    className={styles.closeItemButton}
                    onClick={(e) => removeNotification(e, item.id)}
                    type="button"
                    aria-label="Dismiss"
                  >
                    <IoCloseOutline size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;