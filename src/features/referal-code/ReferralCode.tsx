'use client'

import { useSearchParams } from "next/navigation"
import { useEffect } from "react";

export const REF_KEY = 'referralCode';

const ReferralCode = () => {
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get('ref');

  useEffect(() => {
    if (!refFromUrl) return;

    const storedRef = localStorage.getItem(REF_KEY);

    // если ref отсутствует или отличается — перезаписываем
    if (storedRef !== refFromUrl) {
      localStorage.setItem(REF_KEY, refFromUrl);
    }
  }, [refFromUrl]);

  return null;
}

export default ReferralCode