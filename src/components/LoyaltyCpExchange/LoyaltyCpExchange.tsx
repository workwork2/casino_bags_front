"use client";

import { useCallback, useMemo, useState } from "react";
import CpCoinIcon from "@/components/icons/CpCoinIcon";
import classes from "./LoyaltyCpExchange.module.scss";

function formatCp(n: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.max(0, Math.floor(n)));
}

type Props = {
  /** Доступно к обмену; при появлении поля `cpWallet` с бэка — передавать его */
  availableCp: number;
  /** Сколько CP за 1 условную единицу бонуса (как кратность у операторов вроде Riobet) */
  cpPerBonusUnit?: number;
  /** Подпись единицы зачисления */
  bonusUnitLabel?: string;
};

export default function LoyaltyCpExchange({
  availableCp,
  cpPerBonusUnit = 100,
  bonusUnitLabel = "бонусного баланса",
}: Props) {
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const amount = useMemo(() => {
    const n = parseInt(raw.replace(/\s/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  }, [raw]);

  const bonusPreview = useMemo(() => {
    if (amount <= 0 || cpPerBonusUnit <= 0) return 0;
    return Math.floor(amount / cpPerBonusUnit);
  }, [amount, cpPerBonusUnit]);

  const applyMax = useCallback(() => {
    const maxRounded =
      Math.floor(availableCp / cpPerBonusUnit) * cpPerBonusUnit;
    setRaw(maxRounded > 0 ? String(maxRounded) : "");
    setError(null);
    setSuccess(false);
  }, [availableCp, cpPerBonusUnit]);

  const onExchange = useCallback(() => {
    setError(null);
    setSuccess(false);

    if (amount <= 0) {
      setError("Введите количество CP.");
      return;
    }
    if (amount % cpPerBonusUnit !== 0) {
      setError(`Сумма должна быть кратна ${formatCp(cpPerBonusUnit)} CP.`);
      return;
    }
    if (amount > availableCp) {
      setError("Недостаточно CP на балансе.");
      return;
    }

    // TODO: POST /vip/exchange-cp или аналог, когда появится контракт API
    setSuccess(true);
    setRaw("");
  }, [amount, availableCp, cpPerBonusUnit]);

  return (
    <section className={classes.panel} aria-labelledby="loyalty-cp-exchange-title">
      <div className={classes.head}>
        <CpCoinIcon className={classes.headIcon} size={44} />
        <div className={classes.headText}>
          <h2 id="loyalty-cp-exchange-title" className={classes.panelTitle}>
            Обмен Comp Points
          </h2>
          <p className={classes.panelHint}>
            Меняйте накопленные CP на {bonusUnitLabel}. Курс фиксированный — как в
            классической программе лояльности казино.
          </p>
        </div>
      </div>

      <div className={classes.balanceRow}>
        <span className={classes.balanceLabel}>
          <CpCoinIcon size={22} />
          Доступно
        </span>
        <span className={classes.balanceValue}>{formatCp(availableCp)} CP</span>
      </div>

      <div className={classes.ratePill} role="note">
        Курс: {formatCp(cpPerBonusUnit)} CP = 1 ед. {bonusUnitLabel}
      </div>

      {error ? (
        <p className={classes.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={classes.formRow}>
        <div className={classes.field}>
          <label className={classes.label} htmlFor="cp-exchange-input">
            Сколько CP обменять
          </label>
          <input
            id="cp-exchange-input"
            className={classes.input}
            inputMode="numeric"
            autoComplete="off"
            placeholder={`Кратно ${formatCp(cpPerBonusUnit)}`}
            value={raw}
            onChange={(e) => {
              setSuccess(false);
              setError(null);
              setRaw(e.target.value.replace(/[^\d]/g, ""));
            }}
          />
        </div>
        <button type="button" className={classes.maxBtn} onClick={applyMax}>
          Максимум
        </button>
      </div>

      <p className={classes.preview}>
        По текущему курсу начислим: <strong>{bonusPreview}</strong> усл. ед. на{" "}
        {bonusUnitLabel}.
      </p>

      <div className={classes.actions}>
        <button type="button" className="app-cta-primary" onClick={onExchange}>
          Обменять
        </button>
      </div>

      {success ? (
        <p className={classes.success} role="status">
          Заявка принята. После подключения API обмен будет проводиться автоматически.
        </p>
      ) : null}
    </section>
  );
}
