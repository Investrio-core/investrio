import { useState } from "react";
import MultiInputBlock from "../../../components/ui/MultiInputBlock/MultiInputBlockVersion2";
const defaultAssets = [
  "Checking Account Balance",
  "Savings Account Balance",
  "Investment Account Balance",
  "Emergency Fund",
];

export default function DefaultInputs() {
  const [checkingAccountBalance, setCheckingAccountBalance] = useState(0);
  const [savingsAccountBalance, setSavingsAccountBalance] = useState(0);
  const [investmentsAccountBalance, setInvestmentsAccountBalance] = useState(0);
  const [emergencyFundBalance, setEmergencyFundBalance] = useState(0);

  return (
    <div>
      <div
        style={{
          padding: "17px",
          width: "100%",
          borderRadius: "18px",
          border: "1px solid #D2DAFF",
          background: "#FFF",
        }}
      >
        <div className="color-[#100d40] text-2xl font-semibold leading-[33.60px] mb-[17px]">
          Assets
        </div>
        <div className="px-[12px]">
          <MultiInputBlock
            sectionTitleStyles=""
            sectionTitle="Checking Account Balance"
            number={checkingAccountBalance}
            setNumber={setCheckingAccountBalance}
            lastSavedNumber={69}
            step={100}
            max={checkingAccountBalance * 1.03 + 1000}
          />
          <MultiInputBlock
            sectionTitleStyles=""
            sectionTitle="Savings Account Balance"
            number={savingsAccountBalance}
            setNumber={setSavingsAccountBalance}
            lastSavedNumber={69}
            step={100}
            max={savingsAccountBalance * 1.03 + 1000}
          />
          <MultiInputBlock
            sectionTitleStyles=""
            sectionTitle="Investment Account Balance"
            number={investmentsAccountBalance}
            setNumber={setInvestmentsAccountBalance}
            lastSavedNumber={69}
            step={100}
            max={investmentsAccountBalance * 1.03 + 1000}
          />
          <MultiInputBlock
            sectionTitleStyles=""
            sectionTitle="Emergency Fund"
            number={emergencyFundBalance}
            setNumber={setEmergencyFundBalance}
            lastSavedNumber={69}
            step={100}
            max={emergencyFundBalance * 1.03 + 1000}
          />
        </div>
      </div>
      <div
        style={{
          padding: "17px",
          width: "100%",
          borderRadius: "18px",
          border: "1px solid #D2DAFF",
          background: "#FFF",
          marginTop: "11px",
        }}
      >
        <div className="color-[#100d40] text-2xl font-semibold leading-[33.60px] mb-[17px]">
          Debts
        </div>
      </div>
    </div>
  );
}
