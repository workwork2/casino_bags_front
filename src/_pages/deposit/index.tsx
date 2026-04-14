"use client";

import React, { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  IoArrowDownCircleOutline,
  IoCopyOutline,
  IoLayersOutline,
  IoQrCodeOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
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
import WalletNavigation from "@/components/WalletNavigation/WalletNavigation";
import { WalletPageLayout, WalletStepper } from "@/shared/ui";
import type { WalletStepDef } from "@/shared/ui";
import { CurrencyIcon } from "@/shared/ui/CurrencyIcon/CurrencyIcon";
import {
  formatCryptoMinAmount,
  getEffectiveMinDepositCrypto,
} from "@/shared/lib/wallet/minWithdrawUsd";

const DEPOSIT_STEPS: WalletStepDef[] = [
  {
    label: "Choose cryptocurrency",
    hint: "Pick the asset and network you will send from.",
    Icon: IoLayersOutline,
  },
  {
    label: "Get address & send",
    hint: "Generate a unique address and transfer only on this network.",
    Icon: IoQrCodeOutline,
  },
  {
    label: "Blockchain confirmations",
    hint: "Balance updates after required confirmations.",
    Icon: IoShieldCheckmarkOutline,
  },
];

export default function DepositPage() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector(walletsSelectors.selectAll);
  const currenciesEntities = useAppSelector(currenciesSelectors.selectEntities);

  const availableWallets = useMemo(() => {
    return wallets
      .map((wallet) => ({
        ...wallet,
        currency: currenciesEntities[wallet.currencyId],
      }))
      .filter(
        (w) => w.currency && w.currency.isActive && w.currency.isDepositEnabled,
      );
  }, [wallets, currenciesEntities]);

  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedWallet = availableWallets.find(
    (w) => w.id === selectedWalletId,
  );

  const effectiveMinDepositCrypto = useMemo(() => {
    if (!selectedWallet?.currency) return 0;
    return getEffectiveMinDepositCrypto(selectedWallet.currency);
  }, [selectedWallet]);

  const effectiveMinDepositLabel = useMemo(() => {
    if (!selectedWallet?.currency) return "";
    return `${formatCryptoMinAmount(effectiveMinDepositCrypto)} ${selectedWallet.currency.symbol}`;
  }, [selectedWallet, effectiveMinDepositCrypto]);

  useEffect(() => {
    const load = async () => {
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
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    if (availableWallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(availableWallets[0].id);
    }
  }, [availableWallets, selectedWalletId]);

  useEffect(() => {
    setDepositAddress(null);
    setError(null);
    setCopied(false);
  }, [selectedWalletId]);

  const depositActiveStep = depositAddress ? 2 : selectedWallet ? 1 : 0;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleGenerateAddress = async () => {
    if (!selectedWallet) return;

    setIsLoadingAddress(true);
    setError(null);
    try {
      const response = await api.post("/wallet/deposit-address", {
        currencyId: selectedWallet.currencyId,
      });

      setDepositAddress(response.data.address);
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
          : "Failed to generate address";
      setError(msg);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  return (
    <WalletPageLayout
      title="Deposit"
      subtitle="Add funds in a few steps — choose an asset, get your address, send crypto on the correct network."
      titleIcon={<IoArrowDownCircleOutline size={40} aria-hidden />}
      navSlot={<WalletNavigation />}
    >
      <WalletStepper steps={DEPOSIT_STEPS} activeIndex={depositActiveStep} />

      <div className={styles.contentColumns}>
        <div className={styles.leftSection}>
          <p className={styles.sectionLabel}>Available assets</p>
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
          {selectedWallet ? (
            <div className={styles.paymentDetails}>
              <div className={styles.detailsHeader}>
                <div className={styles.selectedTitle}>
                  <span className={styles.headerIcon}>
                    <CurrencyIcon
                      symbol={selectedWallet.currency!.symbol}
                      apiIconPath={selectedWallet.currency!.icon}
                      size={28}
                      variant="ui"
                    />
                  </span>
                  <div>
                    <h2 className={styles.detailsHeading}>
                      {selectedWallet.currency!.name}
                    </h2>
                    <span className={styles.networkName}>
                      {selectedWallet.currency!.network} network
                    </span>
                  </div>
                </div>
                <span className={styles.badge}>
                  {selectedWallet.currency!.minConfirmations} confirmations
                </span>
              </div>

              <div className={styles.cryptoForm}>
                <div className={styles.warningBox}>
                  <IoShieldCheckmarkOutline
                    size={20}
                    className={styles.warningIcon}
                    aria-hidden
                  />
                  <span>
                    Send only <strong>{selectedWallet.currency!.symbol}</strong>{" "}
                    via <strong>{selectedWallet.currency!.network}</strong>.
                    Other assets may be lost.
                  </span>
                </div>

                <label
                  className={styles.label}
                  htmlFor="deposit-address-readonly"
                >
                  Deposit address
                </label>

                {!depositAddress ? (
                  <div className={styles.generateContainer}>
                    {error && (
                      <div className={styles.errorMessage}>{error}</div>
                    )}
                    <button
                      type="button"
                      className={styles.generateBtn}
                      onClick={handleGenerateAddress}
                      disabled={isLoadingAddress}
                    >
                      {isLoadingAddress
                        ? "Generating…"
                        : "Generate deposit address"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.addressBox}>
                      <input
                        id="deposit-address-readonly"
                        readOnly
                        value={depositAddress}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(depositAddress)}
                        className={styles.copyBtn}
                      >
                        <IoCopyOutline size={18} />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className={styles.qrContainer}>
                      <div className={styles.qrWrapper}>
                        <QRCode value={depositAddress} size={160} />
                      </div>
                      <p className={styles.qrHint}>Scan to send</p>
                    </div>
                  </>
                )}

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span>Minimum deposit</span>
                    <strong>{effectiveMinDepositLabel}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Current balance</span>
                    <strong>
                      {Number(selectedWallet.realBalance).toFixed(6)}{" "}
                      {selectedWallet.currency!.symbol}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <IoLayersOutline size={40} className={styles.emptyIcon} />
              <p>No deposit methods available for your account.</p>
            </div>
          )}
        </div>
      </div>
    </WalletPageLayout>
  );
}
