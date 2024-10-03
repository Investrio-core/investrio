export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string; //"depository" | "loan" | "investment" | "credit"
  subtype: string; // "checking"
  verification_status?: boolean;
  class_type?: string;
}

export type Depository = "savings" | "checking" | "cd" | "money market";
