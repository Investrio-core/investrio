import Select from "@/app/components/ui/Select";
import Input from "@/app/components/ui/Input";

export default function DebtFormFields({
  balance,
  rate,
  debtType,
}: {
  balance?: string;
  debtType?: string;
  rate?: string;
}) {
  return (
    <>
      <Select
        label={`Debt Category`}
        name="debtType"
        options={[
          {
            label: "Credit Card",
            value: "CreditCard",
          },
          // {
          //   label: "Auto Loan",
          //   value: "AutoLoan",
          // },
          // {
          //   label: "Personal Loan",
          //   value: "PersonalLoan",
          // },
          // {
          //   label: "Student Loan",
          //   value: "StudentLoan",
          // },
          // {
          //   label: "Mortgage",
          //   value: "Mortgage",
          // },
          // {
          //   label: "Medical Loan",
          //   value: "MedicalLoan",
          // },
          // {
          //   label: "Taxes",
          //   value: "Taxes",
          // },
          // {
          //   label: "Other",
          //   value: "Other",
          // },
        ]}
        inline
        required
        //   value={recurringExpense}
        //   onChange={(e) => {
        //     if (e?.target?.value !== undefined) {
        //       setRecurringExpense(e?.target?.value);
        //     }
        //   }}
        defaultValue={debtType ?? ""}
      />

      <Input
        label="Interest Rate"
        name="rate"
        type="percentage"
        placeholder="00.00%"
        minNumberValue={0.01}
        inline
        required
        // defaultValue={selectedDebt?.rate}
        // defaultValue={0}
        // setFormHasError={setEditFormHasError}
        defaultValue={rate ?? ""}
      />

      <Input
        label="Outstanding Balance"
        name="balance"
        type="currency"
        placeholder="$00.00"
        inline
        required
        minNumberValue={0.01}
        defaultValue={balance ?? ""}
        // defaultValue={selectedDebt?.balance}
        // onChange={setEditOutstandingBalance}
        // setFormHasError={setEditFormHasError}
        // defaultValue={0}
      />
    </>
  );
}
