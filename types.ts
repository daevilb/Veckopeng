export interface User {
  id: string;
  name: string;
  role: 'parent' | 'child';

  // OLD:
  // phoneNumber?: string;

  // NEW:
  paymentMethods?: {
    swish?: {
      phoneNumber: string;
    };
    venmo?: {
      username: string;
    };
    cashapp?: {
      cashtag: string;
    };
  };

  // Existing fields
  balance: number;
}
