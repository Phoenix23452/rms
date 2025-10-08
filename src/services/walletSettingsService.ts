export interface WalletSettings {
  id: string;
  min_withdraw_amount: number;
  max_withdraw_amount: number;
  withdrawal_fee: number;
  created_at: string;
  updated_at: string;
  [key: string]: any; // for extra fields if needed
}

// In-memory mock data
let walletSettings: WalletSettings | null = {
  id: "wallet-settings-1",
  min_withdraw_amount: 10,
  max_withdraw_amount: 1000,
  withdrawal_fee: 2.5,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchWalletSettings = async (): Promise<WalletSettings | null> => {
  await delay(50);
  return walletSettings;
};

export const updateWalletSettings = async (
  settings: Partial<WalletSettings>,
): Promise<WalletSettings | null> => {
  await delay(50);
  if (!walletSettings) return null;

  walletSettings = {
    ...walletSettings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  return walletSettings;
};
