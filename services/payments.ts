export type PaymentProvider = 'swish' | 'venmo' | 'cashapp';

export interface SwishPaymentParams {
  phoneNumber: string;
  amount: number;
  message?: string;
}

export interface VenmoPaymentParams {
  username: string;
  amount: number;
  note?: string;
}

export interface CashAppPaymentParams {
  cashtag: string;
  amount: number;
  note?: string;
}

/**
 * Build a Swish deep link URL for the given parameters.
 * Kept in a helper so we can keep the Swish logic in one place.
 */
export const buildSwishPaymentUrl = (params: SwishPaymentParams): string => {
  const { phoneNumber, amount, message = 'Veckopeng' } = params;

  const paymentData = {
    version: 1,
    payee: { value: phoneNumber },
    amount: { value: amount },
    message: { value: message },
  };

  return `swish://payment?data=${encodeURIComponent(
    JSON.stringify(paymentData),
  )}`;
};

/**
 * Build a Venmo deep link URL.
 * This is experimental and may behave differently depending on the Venmo app/version.
 */
export const buildVenmoPaymentUrl = (params: VenmoPaymentParams): string => {
  const { username, amount, note = 'Veckopeng' } = params;

  return `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(
    username,
  )}&amount=${encodeURIComponent(String(amount))}&note=${encodeURIComponent(
    note,
  )}`;
};

/**
 * Build a Cash App deep link URL.
 * This is experimental and may behave differently depending on the Cash App app/version.
 */
export const buildCashAppPaymentUrl = (params: CashAppPaymentParams): string => {
  const { cashtag, amount, note = 'Veckopeng' } = params;

  // We keep it simple and rely on the app handling the cashtag format.
  return `cashapp://send?amount=${encodeURIComponent(
    String(amount),
  )}&recipient=${encodeURIComponent(cashtag)}&note=${encodeURIComponent(
    note,
  )}`;
};
