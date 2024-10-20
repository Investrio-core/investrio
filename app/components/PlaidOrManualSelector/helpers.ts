import { Account } from "./RenderPlaidLinksTable";

const hasUnclassifiedAccounts = (accounts: Account[]) => {
  return accounts.some((account) => !account.accountCategory);
};

export { hasUnclassifiedAccounts };