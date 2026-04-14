"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  IoArrowUpCircleOutline,
  IoCheckmarkCircleOutline,
  IoCreateOutline,
  IoWalletOutline,
} from "react-icons/io5";
import WalletNavigation from "@/components/WalletNavigation/WalletNavigation";

import styles from "./page.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/lib/redux/hooks";
import {
  currenciesActions,
  currenciesSelectors,
} from "@/entities/currency/model/slice";
import {
  walletsActions,
  walletsSelectors,
} from "@/entities/wallet/model/slice";
import { api } from "@/shared/lib/api/axios";
import { getMyWallets } from "@/entities/wallet/api/walletApi";
import {
  cryptoToUsdAmount,
  formatCryptoMinAmount,
  getEffectiveMinWithdrawalCrypto,
  MIN_CASHIER_USD,
} from "@/shared/lib/wallet/minWithdrawUsd";
import { WalletPageLayout, WalletStepper } from "@/shared/ui";
import type { WalletStepDef } from "@/shared/ui";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";

const WITHDRAW_STEPS: WalletStepDef[] = [
  {
    label: "Choose cryptocurrency",
    hint: "Select the asset you want to cash out.",
    Icon: IoWalletOutline,
  },
  {
    label: "Destination & amount",
    hint: "Enter a valid on-chain address and amount.",
    Icon: IoCreateOutline,
  },
  {
    label: "Request submitted",
    hint: "We will process your withdrawal after review.",
    Icon: IoCheckmarkCircleOutline,
  },
];

export default function WithdrawPage() {
  const wallets = useAppSelector(walletsSelectors.selectAll);
  const currenciesEntities = useAppSelector(currenciesSelectors.selectEntities);
  const dispatch = useAppDispatch();

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const availableWallets = useMemo(() => {
    return wallets
      .map((wallet) => ({
        ...wallet,
        currency: currenciesEntities[wallet.currencyId],
      }))
      .filter(
        (w) =>
          w.currency && w.currency.isActive && w.currency.isWithdrawalEnabled,
      );
  }, [wallets, currenciesEntities]);

  const selectedWallet = availableWallets.find(
    (w) => w.id === selectedWalletId,
  );

  const effectiveMinCrypto = selectedWallet?.currency
    ? getEffectiveMinWithdrawalCrypto(selectedWallet.currency)
    : 0;

  const effectiveMinLabel = selectedWallet?.currency
    ? `${formatCryptoMinAmount(effectiveMinCrypto)} ${selectedWallet.currency.symbol}`
    : "";

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const data = await getMyWallets();
        if (data?.wallets?.length) {
          dispatch(
            currenciesActions.upsertMany(data.wallets.map((w) => w.currency)),
          );
          dispatch(
            walletsActions.upsertMany(
              data.wallets.map(({ currency, ...w }) => w),
            ),
          );

          const activeWallet = data.wallets.find(
            (w) =>
              w.id === data.activeWalletId && w.currency.isWithdrawalEnabled,
          );
          const firstAvailable = data.wallets.find(
            (w) => w.currency.isWithdrawalEnabled,
          );

          if (activeWallet) {
            setSelectedWalletId(activeWallet.id);
          } else if (firstAvailable) {
            setSelectedWalletId(firstAvailable.id);
          }
        }
      } catch (err) {
        console.error("Failed to load wallets:", err);
      }
    };
    loadWallets();
  }, [dispatch]);

  useEffect(() => {
    setAmount("");
    setAddress("");
    setError(null);
    setSuccess(null);
  }, [selectedWalletId]);

  const withdrawActiveStep = !selectedWallet ? 0 : success ? 2 : 1;

  const handleWithdraw = async () => {
    if (!selectedWallet || !amount || !address) {
      setError("Please fill all fields.");
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(selectedWallet.realBalance || "0");

    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Amount must be positive.");
      return;
    }
    if (amountNum > balanceNum) {
      setError("Insufficient balance.");
      return;
    }
    if (amountNum < effectiveMinCrypto) {
      setError(
        `Minimum withdrawal is ${effectiveMinLabel} (includes a $${MIN_CASHIER_USD} USD minimum).`,
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/wallet/withdraw/request", {
        currencyId: selectedWallet.currencyId,
        amount,
        address,
      });

      setSuccess(
        "Withdrawal request created. Our team will review and process it shortly.",
      );
      setAmount("");
      setAddress("");

      const data = await getMyWallets();
      if (data) {
        dispatch(
          walletsActions.upsertMany(
            data.wallets.map(({ currency, ...w }) => w),
          ),
        );
      }
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : "An error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const setPresetUsdAmount = (usdValue: string) => {
    if (!selectedWallet?.currency) return;
    const balanceCrypto = parseFloat(selectedWallet.realBalance || "0");
    const priceUsd = parseFloat(selectedWallet.currency.priceUsd || "1");
    const safePrice =
      !Number.isFinite(priceUsd) || priceUsd <= 0 ? 1 : priceUsd;
    const targetCryptoAmount = parseFloat(usdValue) / safePrice;
    const finalAmount = Math.min(balanceCrypto, targetCryptoAmount);
    setAmount(finalAmount.toFixed(8).replace(/\.?0+$/, "") || "0");
  };

  const setMaxAmount = () => {
    if (selectedWallet) {
      setAmount(selectedWallet.realBalance || "0");
    }
  };

  const amountNum = parseFloat(amount);
  const usdPreview =
    selectedWallet?.currency && Number.isFinite(amountNum) && amountNum > 0
      ? cryptoToUsdAmount(amountNum, selectedWallet.currency)
      : null;

  return (
    <WalletPageLayout
      title="Withdraw"
      subtitle="Send crypto to your external wallet. Double-check the network — wrong chain means lost funds."
      titleIcon={<IoArrowUpCircleOutline size={40} aria-hidden />}
      navSlot={<WalletNavigation />}
    >
      <WalletStepper steps={WITHDRAW_STEPS} activeIndex={withdrawActiveStep} />

      <div className={styles.contentColumns}>
        <div className={styles.leftSection}>
          <p className={styles.sectionLabel}>Withdrawal asset</p>
          <div className={styles.methodsGrid}>
            {availableWallets.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                className={`${styles.methodCard} ${selectedWalletId === wallet.id ? styles.active : ""}`}
                onClick={() => setSelectedWalletId(wallet.id)}
              >
                <span className={styles.methodIcon}>
                  <CurrencyIcon
                    symbol={wallet.currency!.symbol}
                    apiIconPath={wallet.currency!.icon}
                    size={28}
                    variant="ui"
                    color={selectedWalletId === wallet.id ? "#fff" : undefined}
                  />
                </span>
                <span className={styles.methodName}>
                  {wallet.currency!.name}
                </span>
                <span className={styles.networkBadge}>
                  {wallet.currency!.network}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightSection}>
          {selectedWallet && selectedWallet.currency ? (
            <div className={styles.paymentDetails}>
              <div className={styles.detailsHeader}>
                <div className={styles.selectedTitle}>
                  <span className={styles.headerIcon}>
                    <CurrencyIcon
                      symbol={selectedWallet.currency.symbol}
                      apiIconPath={selectedWallet.currency.icon}
                      size={28}
                      variant="ui"
                    />
                  </span>
                  <div>
                    <h2 className={styles.detailsHeading}>
                      {selectedWallet.currency.name}
                    </h2>
                    <span className={styles.networkName}>
                      {selectedWallet.currency.network} network
                    </span>
                  </div>
                </div>
                <span className={styles.feeBadge}>
                  Fee {selectedWallet.currency.withdrawalFee}{" "}
                  {selectedWallet.currency.symbol}
                </span>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span>Minimum withdrawal</span>
                  <strong>{effectiveMinLabel}</strong>
                </div>
                <div className={styles.infoItem}>
                  <span>Available balance</span>
                  <strong>
                    {parseFloat(selectedWallet.realBalance || "0").toFixed(6)}{" "}
                    {selectedWallet.currency.symbol}
                  </strong>
                </div>
              </div>

              <div className={styles.fiatForm}>
                <label className={styles.label} htmlFor="withdraw-address">
                  Your {selectedWallet.currency.symbol} address (
                  {selectedWallet.currency.network})
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="withdraw-address"
                    type="text"
                    autoComplete="off"
                    placeholder="Paste wallet address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <label className={styles.label} htmlFor="withdraw-amount">
                  Amount (available{" "}
                  {parseFloat(selectedWallet.realBalance || "0").toFixed(6)}{" "}
                  {selectedWallet.currency.symbol})
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="withdraw-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <span className={styles.currencySymbol}>
                    {selectedWallet.currency.symbol}
                  </span>
                </div>

                {usdPreview !== null && Number.isFinite(usdPreview) ? (
                  <p className={styles.usdHint}>
                    ≈ ${usdPreview.toFixed(2)} USD
                  </p>
                ) : null}

                <div className={styles.presets}>
                  {["25", "50", "100", "250"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPresetUsdAmount(val)}
                    >
                      ${val}
                    </button>
                  ))}
                  <button type="button" onClick={setMaxAmount}>
                    MAX
                  </button>
                </div>

                {error && <p className={styles.errorText}>{error}</p>}
                {success && <p className={styles.successText}>{success}</p>}

                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={handleWithdraw}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing…" : "Request withdrawal"}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <IoWalletOutline size={40} className={styles.emptyIcon} />
              <p>No wallets available for withdrawal.</p>
            </div>
          )}
        </div>
      </div>
    </WalletPageLayout>
  );
}
