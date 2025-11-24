export type PaymentProvider = 'swish';


export interface SwishPaymentParams {
  phoneNumber: string;
  amount: number;
  message?: string;
}

/**
 * Build a Swish deep link URL for the given parameters.
 * This is kept in a separate helper so we can later add
 * Venmo / Cash App etc. alongside Swish.
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
