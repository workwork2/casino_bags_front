"use client";

import type { ReactNode } from "react";
import Chat from "@/widgets/chat/ui";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import MobileBottomNav from "@/components/MobileBottomNav/MobileBottomNav";
import SlideBar from "@/components/SlideBar/SlideBar";

type Props = {
  children: ReactNode;
};

/** Общая оболочка страниц (хедер, сайдбар, футер, чат). Без сокетов — их оставляем в `(app)/layout`. */
export function AppShell({ children }: Props) {
  return (
    <>
      <Chat />
      <div className="wrapper">
        <Header />
        <main className="mainContent">
          <SlideBar />
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </>
  );
}
