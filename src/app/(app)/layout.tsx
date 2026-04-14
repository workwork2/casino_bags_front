"use client";

import { useSocket } from "@/shared/hooks/useSocket";
import { useEffect } from "react";
import { useAppDispatch } from "@/shared/lib/redux/hooks";
import { walletsActions } from "@/entities/wallet/model/slice";
import {
  addSocketBet,
  updateBetStatus,
  BetItem,
} from "@/entities/bet/model/slice";
import { AppShell } from "@/components/AppShell/AppShell";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleBalanceUpdate = (payload: {
      walletId: string;
      realBalance: string;
      lockedBalance: string;
      balanceUsd: string;
    }) => {
      dispatch(
        walletsActions.applyBalancePatch({
          walletId: payload.walletId,
          patch: {
            realBalance: payload.realBalance,
            lockedBalance: payload.lockedBalance,
            balanceUsd: payload.balanceUsd,
          },
        }),
      );
    };

    socket.on("wallet.balance", handleBalanceUpdate);

    // ИСПРАВЛЕНИЕ: Убрали () => перед (newBetData)
    const handleNewBet = (newBetData: BetItem) => {
      console.log("Новая ставка из сокета:", newBetData);
      dispatch(addSocketBet(newBetData));
    };

    const handleUpdateBet = (updatedBetData: BetItem) => {
      dispatch(updateBetStatus(updatedBetData));
    };

    socket.on("bet.new", handleNewBet);
    socket.on("bet.update", handleUpdateBet);

    return () => {
      socket.off("bet.new", handleNewBet);
      socket.off("bet.update", handleUpdateBet);
      socket.off("wallet.balance", handleBalanceUpdate);
    };
  }, [socket, dispatch]);

  return <AppShell>{children}</AppShell>;
};

export default Layout;
