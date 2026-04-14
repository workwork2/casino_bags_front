// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import styles from "./BalanceDropdown.module.scss";
// import { IoChevronDownOutline } from "react-icons/io5";
// import { NAV_ICON_SIZE } from "@/shared/config/navigation";
// import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";
// import { useAppDispatch, useAppSelector } from "@/shared/lib/redux/hooks";
// import {
//   walletsActions,
//   walletsSelectors,
// } from "@/entities/wallet/model/slice";
// import {
//   currenciesActions,
//   currenciesSelectors,
// } from "@/entities/currency/model/slice";

// import Big from "big.js";
// import {
//   getMyWallets,
//   selectWallet,
//   swapCurrency,
// } from "@/entities/wallet/api/walletApi";
// import {
//   applyWalletUiDemo,
//   isWalletUiDemoMode,
// } from "@/shared/config/walletUiDemo";
// import { useParams } from "next/navigation";
// import { openGame } from "@/entities/game/model/slice";

// const formatUsdTotal = (n: number) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(n);

// const BalanceDropdown: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const params = useParams();
//   const gameIdFromRoute = useMemo(() => {
//     const raw = params?.id;
//     if (typeof raw === "string") return raw;
//     if (Array.isArray(raw) && raw[0]) return raw[0];
//     return undefined;
//   }, [params]);
//   const wallets = useAppSelector(walletsSelectors.selectAll);
//   const currencies = useAppSelector(currenciesSelectors.selectEntities);
//   const selectedWallet = useAppSelector(walletsSelectors.selectedWallet);
//   const selectedWalletId = useAppSelector(walletsSelectors.selectedWalletId);

//   const [isOpen, setIsOpen] = useState(false);
//   const [isSwapMode, setIsSwapMode] = useState(false);
//   const [loadState, setLoadState] = useState<"loading" | "ready">("loading");

//   const [swapAmount, setSwapAmount] = useState("");
//   const [targetCurrencyId, setTargetCurrencyId] = useState<string>("");
//   const [isSwapping, setIsSwapping] = useState(false);

//   const loadWallets = useCallback(async () => {
//     setLoadState("loading");

//     // if (isWalletUiDemoMode) {
//     //   applyWalletUiDemo(dispatch);
//     //   setLoadState("ready");
//     //   return;
//     // }

//     const data = await getMyWallets();

//     if (!data) {
//       dispatch(walletsActions.resetWallets());
//       setLoadState("ready");
//       return;
//     }

//     const { wallets: fetchedWallets, activeWalletId } = data;
//     const currenciesData = fetchedWallets.map((w) => w.currency);
//     const walletsData = fetchedWallets.map(({ currency: _c, ...w }) => w);

//     dispatch(currenciesActions.upsertMany(currenciesData));
//     dispatch(walletsActions.upsertMany(walletsData));

//     if (walletsData.length === 0) {
//       dispatch(walletsActions.resetWallets());
//       setLoadState("ready");
//       return;
//     }

//     const walletExists = walletsData.find((w) => w.id === activeWalletId);
//     if (activeWalletId && walletExists) {
//       dispatch(walletsActions.setSelectedWallet(activeWalletId));
//     } else {
//       const w0 = walletsData[0];
//       dispatch(walletsActions.setSelectedWallet(w0.id));
//       try {
//         await selectWallet(w0.currencyId, w0.id);
//       } catch (e) {
//         console.error("selectWallet failed", e);
//       }
//     }

//     setLoadState("ready");
//   }, [dispatch]);

//   useEffect(() => {
//     loadWallets();
//   }, [loadWallets]);

//   const onSelectWallet = async (walletId: string, currencyId: string) => {
//     if (walletId !== selectedWalletId) {
//       dispatch(walletsActions.setSelectedWallet(walletId));

//       if (!isWalletUiDemoMode) {
//         const res = await selectWallet(currencyId, walletId);

//         if (res && gameIdFromRoute) {
//           dispatch(openGame(gameIdFromRoute));
//         }
//       } else if (gameIdFromRoute) {
//         dispatch(openGame(gameIdFromRoute));
//       }
//     }
//     setIsOpen(false);
//     setIsSwapMode(false);
//   };

//   const handleSwap = async () => {
//     if (!selectedWallet || !targetCurrencyId || !swapAmount) return;

//     if (isWalletUiDemoMode) {
//       window.alert(
//         "Demo: exchange is disabled. Enable NEXT_PUBLIC_WALLET_UI_DEMO=0 with a backend for swaps.",
//       );
//       return;
//     }

//     try {
//       setIsSwapping(true);
//       await swapCurrency(
//         selectedWallet.currencyId,
//         targetCurrencyId,
//         swapAmount,
//       );

//       await loadWallets();

//       setIsSwapMode(false);
//       setIsOpen(false);
//       setSwapAmount("");

//       if (gameIdFromRoute) {
//         dispatch(openGame(gameIdFromRoute));
//       }
//     } catch (error: unknown) {
//       const msg =
//         error &&
//         typeof error === "object" &&
//         "response" in error &&
//         error.response &&
//         typeof error.response === "object" &&
//         "data" in error.response &&
//         error.response.data &&
//         typeof error.response.data === "object" &&
//         "message" in error.response.data
//           ? String((error.response.data as { message?: string }).message)
//           : "Exchange failed";
//       alert(msg);
//     } finally {
//       setIsSwapping(false);
//     }
//   };

//   const currency = selectedWallet
//     ? currencies[selectedWallet.currencyId]
//     : undefined;
//   const hasWallet = Boolean(selectedWallet && currency);

//   const activeBalance = selectedWallet?.realBalance
//     ? Big(selectedWallet.realBalance).toFixed(8)
//     : "0.00000000";
//   const displaySymbol = currency?.symbol ?? "—";

//   const totalBalanceUsd = useMemo(() => {
//     return wallets.reduce((acc, w) => {
//       const v = parseFloat(w.balanceUsd || "0");
//       return acc + (Number.isFinite(v) ? v : 0);
//     }, 0);
//   }, [wallets]);

//   const targetSwapCurrency =
//     targetCurrencyId && currencies[targetCurrencyId]
//       ? currencies[targetCurrencyId]
//       : undefined;

//   return (
//     <div className={styles.wrapper}>
//       <button
//         className={`${styles.balanceButton} ${isOpen ? styles.active : ""}`}
//         onClick={() => {
//           setIsOpen((p) => !p);
//           if (isOpen) setIsSwapMode(false);
//         }}
//         type="button"
//         disabled={loadState === "loading"}
//       >
//         <span className={styles.balanceValue}>
//           <span className={styles.balanceText}>
//             {loadState === "loading"
//               ? "…"
//               : `${activeBalance} ${displaySymbol}`}
//           </span>
//           <CurrencyIcon
//             symbol={displaySymbol === "—" ? "" : displaySymbol}
//             apiIconPath={currency?.icon}
//             alt={currency?.symbol}
//             size={NAV_ICON_SIZE}
//             variant="ui"
//             className={styles.currencyGlyph}
//           />
//         </span>

//         <div className={styles.arrowIcon}>
//           <IoChevronDownOutline
//             size={NAV_ICON_SIZE}
//             aria-hidden
//             className={styles.chevron}
//           />
//         </div>
//       </button>

//       {isOpen && (
//         <div className={styles.dropdownList}>
//           {!isSwapMode && wallets.length > 0 && (
//             <div className={styles.capitalRow}>
//               <span className={styles.capitalLabel}>Total balance</span>
//               <span className={styles.capitalValue}>
//                 {formatUsdTotal(totalBalanceUsd)}
//               </span>
//             </div>
//           )}
//           {!isSwapMode && (
//             <>
//               {wallets.length > 0 && (
//                 <div className={styles.actionsWrapper}>
//                   <button
//                     type="button"
//                     className={styles.actionBtn}
//                     disabled={!hasWallet}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       if (hasWallet) setIsSwapMode(true);
//                     }}
//                   >
//                     Exchange
//                   </button>
//                 </div>
//               )}

//               {wallets.length === 0 ? (
//                 <div className={styles.emptyState}>
//                   <p>No wallet yet</p>
//                   <Link
//                     href="/deposit"
//                     className={`app-cta-primary ${styles.depositLink}`}
//                   >
//                     Deposit
//                   </Link>
//                 </div>
//               ) : (
//                 wallets.map((w) => {
//                   const c = currencies[w.currencyId];
//                   if (!c || !c.isActive) return null;

//                   const balance = w.realBalance
//                     ? Big(w.realBalance).toFixed(6)
//                     : "0.000000";

//                   return (
//                     <div
//                       key={w.id}
//                       role="button"
//                       tabIndex={0}
//                       className={`${styles.dropdownItem} ${
//                         w.id === selectedWalletId ? styles.selected : ""
//                       }`}
//                       onClick={() => onSelectWallet(w.id, c.id)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ")
//                           onSelectWallet(w.id, c.id);
//                       }}
//                     >
//                       <div className={styles.itemLeft}>
//                         <CurrencyIcon
//                           symbol={c.symbol}
//                           apiIconPath={c.icon}
//                           alt={c.symbol}
//                           size={NAV_ICON_SIZE}
//                           variant="ui"
//                           className={styles.currencyGlyph}
//                         />
//                         <span className={styles.itemCurrencyName}>
//                           {c.name}
//                         </span>
//                       </div>

//                       <div className={styles.itemRight}>
//                         <span className={styles.itemBalance}>
//                           <span>{balance}</span>
//                           <span>{c.symbol}</span>
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </>
//           )}

//           {isSwapMode && hasWallet && currency && (
//             <div className={styles.swapContainer}>
//               <h3 className={styles.swapTitle}>Exchange</h3>
//               <p className={styles.swapSubtitle}>
//                 Convert between your wallets — same colors and typography as
//                 cash desk pages.
//               </p>

//               <div className={styles.swapField}>
//                 <label className={styles.swapLabel}>
//                   <CurrencyIcon
//                     symbol={currency.symbol}
//                     apiIconPath={currency.icon}
//                     size={18}
//                     variant="ui"
//                     className={styles.swapLabelIcon}
//                   />
//                   Pay ({currency.symbol})
//                 </label>
//                 <div className={styles.swapInputWrapper}>
//                   <input
//                     type="number"
//                     value={swapAmount}
//                     onChange={(e) => setSwapAmount(e.target.value)}
//                     placeholder={`Max: ${activeBalance}`}
//                     className={styles.swapInput}
//                   />
//                   <button
//                     type="button"
//                     className={styles.maxBtn}
//                     onClick={() => setSwapAmount(activeBalance)}
//                   >
//                     MAX
//                   </button>
//                 </div>
//               </div>

//               <div className={styles.swapField}>
//                 <label className={styles.swapLabel}>
//                   {targetSwapCurrency ? (
//                     <CurrencyIcon
//                       symbol={targetSwapCurrency.symbol}
//                       apiIconPath={targetSwapCurrency.icon}
//                       size={18}
//                       variant="ui"
//                       className={styles.swapLabelIcon}
//                     />
//                   ) : (
//                     <span
//                       className={styles.swapLabelIconPlaceholder}
//                       aria-hidden
//                     />
//                   )}
//                   Receive
//                 </label>
//                 <select
//                   className={styles.swapSelect}
//                   value={targetCurrencyId}
//                   onChange={(e) => setTargetCurrencyId(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Choose currency
//                   </option>
//                   {wallets
//                     .filter((w) => w.currencyId !== selectedWallet!.currencyId)
//                     .map((w) => {
//                       const c = currencies[w.currencyId];
//                       return (
//                         <option key={w.currencyId} value={w.currencyId}>
//                           {c?.symbol} — {c?.name}
//                         </option>
//                       );
//                     })}
//                 </select>
//               </div>

//               <div className={styles.swapButtons}>
//                 <button
//                   type="button"
//                   className={styles.cancelBtn}
//                   onClick={() => setIsSwapMode(false)}
//                   disabled={isSwapping}
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   className={styles.confirmBtn}
//                   onClick={handleSwap}
//                   disabled={!swapAmount || !targetCurrencyId || isSwapping}
//                 >
//                   {isSwapping ? "Exchanging..." : "Confirm Swap"}
//                 </button>
//               </div>
//               <div className={styles.swapNote}>
//                 1% exchange fee applies. Rates are indicative.
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BalanceDropdown;

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./BalanceDropdown.module.scss";
import { IoChevronDownOutline } from "react-icons/io5";
import { NAV_ICON_SIZE } from "@/shared/config/navigation";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";
import { useAppDispatch, useAppSelector } from "@/shared/lib/redux/hooks";
import {
  walletsActions,
  walletsSelectors,
} from "@/entities/wallet/model/slice";
import {
  currenciesActions,
  currenciesSelectors,
} from "@/entities/currency/model/slice";

import Big from "big.js";
import {
  getMyWallets,
  selectWallet,
  swapCurrency,
} from "@/entities/wallet/api/walletApi";
import { useParams } from "next/navigation";
import { openGame } from "@/entities/game/model/slice";

const formatUsdTotal = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const BalanceDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const gameIdFromRoute = useMemo(() => {
    const raw = params?.id;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw) && raw[0]) return raw[0];
    return undefined;
  }, [params]);
  const wallets = useAppSelector(walletsSelectors.selectAll);
  const currencies = useAppSelector(currenciesSelectors.selectEntities);
  const selectedWallet = useAppSelector(walletsSelectors.selectedWallet);
  const selectedWalletId = useAppSelector(walletsSelectors.selectedWalletId);

  const [isOpen, setIsOpen] = useState(false);
  const [isSwapMode, setIsSwapMode] = useState(false);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");

  const [swapAmount, setSwapAmount] = useState("");
  const [targetCurrencyId, setTargetCurrencyId] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(
          new CustomEvent("header-popover-open", {
            detail: { source: "balance" },
          }),
        );
      } else {
        setIsSwapMode(false);
      }
      return next;
    });
  };

  const loadWallets = useCallback(async () => {
    setLoadState("loading");

    // if (isWalletUiDemoMode) {
    //   applyWalletUiDemo(dispatch);
    //   setLoadState("ready");
    //   return;
    // }

    const data = await getMyWallets();

    if (!data) {
      // dispatch(walletsActions.resetWallets());
      setLoadState("ready");
      return;
    }

    const { wallets: fetchedWallets, activeWalletId } = data;
    const currenciesData = fetchedWallets.map((w) => w.currency);
    const walletsData = fetchedWallets.map(({ currency: _c, ...w }) => w);

    dispatch(currenciesActions.upsertMany(currenciesData));
    dispatch(walletsActions.upsertMany(walletsData));

    if (walletsData.length === 0) {
      // dispatch(walletsActions.resetWallets());
      setLoadState("ready");
      return;
    }

    const walletExists = walletsData.find((w) => w.id === activeWalletId);
    if (activeWalletId && walletExists) {
      dispatch(walletsActions.setSelectedWallet(activeWalletId));
    } else {
      const w0 = walletsData[0];
      dispatch(walletsActions.setSelectedWallet(w0.id));
      try {
        await selectWallet(w0.currencyId, w0.id);
      } catch (e) {
        console.error("selectWallet failed", e);
      }
    }

    setLoadState("ready");
  }, [dispatch]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  useEffect(() => {
    const closeOnOtherPopoverOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ source?: string }>;
      if (customEvent.detail?.source !== "balance") {
        setIsOpen(false);
        setIsSwapMode(false);
      }
    };

    window.addEventListener("header-popover-open", closeOnOtherPopoverOpen);
    return () =>
      window.removeEventListener(
        "header-popover-open",
        closeOnOtherPopoverOpen,
      );
  }, []);

  const onSelectWallet = async (walletId: string, currencyId: string) => {
    if (walletId !== selectedWalletId) {
      dispatch(walletsActions.setSelectedWallet(walletId));

      const res = await selectWallet(currencyId, walletId);

      if (res && gameIdFromRoute) {
        dispatch(openGame({ id: gameIdFromRoute, walletId }));
      }
    }
    setIsOpen(false);
    setIsSwapMode(false);
  };

  const handleSwap = async () => {
    if (!selectedWallet || !targetCurrencyId || !swapAmount) return;

    try {
      setIsSwapping(true);
      await swapCurrency(
        selectedWallet.currencyId,
        targetCurrencyId,
        swapAmount,
      );

      await loadWallets();

      setIsSwapMode(false);
      setIsOpen(false);
      setSwapAmount("");

      if (gameIdFromRoute) {
        dispatch(
          openGame({ id: gameIdFromRoute, walletId: selectedWalletId! }),
        );
      }
    } catch (error: unknown) {
      const msg =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String((error.response.data as { message?: string }).message)
          : "Exchange failed";
      alert(msg);
    } finally {
      setIsSwapping(false);
    }
  };

  const currency = selectedWallet
    ? currencies[selectedWallet.currencyId]
    : undefined;
  const hasWallet = Boolean(selectedWallet && currency);

  const activeBalance = selectedWallet?.realBalance
    ? Big(selectedWallet.realBalance).toFixed(8)
    : "0.00000000";
  const displaySymbol = currency?.symbol ?? "—";

  const totalBalanceUsd = useMemo(() => {
    return wallets.reduce((acc, w) => {
      const v = parseFloat(w.balanceUsd || "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [wallets]);

  const targetSwapCurrency =
    targetCurrencyId && currencies[targetCurrencyId]
      ? currencies[targetCurrencyId]
      : undefined;

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.balanceButton} ${isOpen ? styles.active : ""}`}
        onClick={toggleDropdown}
        type="button"
        disabled={loadState === "loading"}
      >
        <span className={styles.balanceValue}>
          <span className={styles.balanceText}>
            {loadState === "loading"
              ? "…"
              : `${activeBalance} ${displaySymbol}`}
          </span>
          <CurrencyIcon
            symbol={displaySymbol === "—" ? "" : displaySymbol}
            apiIconPath={currency?.icon}
            alt={currency?.symbol}
            size={NAV_ICON_SIZE}
            variant="ui"
            className={styles.currencyGlyph}
          />
        </span>

        <div className={styles.arrowIcon}>
          <IoChevronDownOutline
            size={NAV_ICON_SIZE}
            aria-hidden
            className={styles.chevron}
          />
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdownList}>
          {!isSwapMode && wallets.length > 0 && (
            <div className={styles.capitalRow}>
              <span className={styles.capitalLabel}>Total balance</span>
              <span className={styles.capitalValue}>
                {formatUsdTotal(totalBalanceUsd)}
              </span>
            </div>
          )}
          {!isSwapMode && (
            <>
              {wallets.length > 0 && (
                <div className={styles.actionsWrapper}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    disabled={!hasWallet}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasWallet) setIsSwapMode(true);
                    }}
                  >
                    Exchange
                  </button>
                </div>
              )}

              {wallets.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No wallet yet</p>
                  <Link
                    href="/deposit"
                    className={`app-cta-primary ${styles.depositLink}`}
                  >
                    Deposit
                  </Link>
                </div>
              ) : (
                wallets.map((w) => {
                  const c = currencies[w.currencyId];
                  if (!c || !c.isActive) return null;

                  const balance = w.realBalance
                    ? Big(w.realBalance).toFixed(6)
                    : "0.000000";

                  return (
                    <div
                      key={w.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.dropdownItem} ${
                        w.id === selectedWalletId ? styles.selected : ""
                      }`}
                      onClick={() => onSelectWallet(w.id, c.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          onSelectWallet(w.id, c.id);
                      }}
                    >
                      <div className={styles.itemLeft}>
                        <CurrencyIcon
                          symbol={c.symbol}
                          apiIconPath={c.icon}
                          alt={c.symbol}
                          size={NAV_ICON_SIZE}
                          variant="ui"
                          className={styles.currencyGlyph}
                        />
                        <span className={styles.itemCurrencyName}>
                          {c.name}
                        </span>
                      </div>

                      <div className={styles.itemRight}>
                        <span className={styles.itemBalance}>
                          <span>{balance}</span>
                          <span>{c.symbol}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {isSwapMode && hasWallet && currency && (
            <div className={styles.swapContainer}>
              <h3 className={styles.swapTitle}>Exchange</h3>
              <p className={styles.swapSubtitle}>
                Convert between your wallets — same colors and typography as
                cash desk pages.
              </p>

              <div className={styles.swapField}>
                <label className={styles.swapLabel}>
                  <CurrencyIcon
                    symbol={currency.symbol}
                    apiIconPath={currency.icon}
                    size={18}
                    variant="ui"
                    className={styles.swapLabelIcon}
                  />
                  Pay ({currency.symbol})
                </label>
                <div className={styles.swapInputWrapper}>
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    placeholder={`Max: ${activeBalance}`}
                    className={styles.swapInput}
                  />
                  <button
                    type="button"
                    className={styles.maxBtn}
                    onClick={() => setSwapAmount(activeBalance)}
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className={styles.swapField}>
                <label className={styles.swapLabel}>
                  {targetSwapCurrency ? (
                    <CurrencyIcon
                      symbol={targetSwapCurrency.symbol}
                      apiIconPath={targetSwapCurrency.icon}
                      size={18}
                      variant="ui"
                      className={styles.swapLabelIcon}
                    />
                  ) : (
                    <span
                      className={styles.swapLabelIconPlaceholder}
                      aria-hidden
                    />
                  )}
                  Receive
                </label>
                <select
                  className={styles.swapSelect}
                  value={targetCurrencyId}
                  onChange={(e) => setTargetCurrencyId(e.target.value)}
                >
                  <option value="" disabled>
                    Choose currency
                  </option>
                  {wallets
                    .filter((w) => w.currencyId !== selectedWallet!.currencyId)
                    .map((w) => {
                      const c = currencies[w.currencyId];
                      return (
                        <option key={w.currencyId} value={w.currencyId}>
                          {c?.symbol} — {c?.name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className={styles.swapButtons}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsSwapMode(false)}
                  disabled={isSwapping}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleSwap}
                  disabled={!swapAmount || !targetCurrencyId || isSwapping}
                >
                  {isSwapping ? "Exchanging..." : "Confirm Swap"}
                </button>
              </div>
              <div className={styles.swapNote}>
                1% exchange fee applies. Rates are indicative.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BalanceDropdown;
