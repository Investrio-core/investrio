import { DEBT_REPAYMENT_STRATEGY_NAME } from "@/app/dashboard/budget/components/BudgetTool";
import { memo } from "react";
import Image from "next/image";

interface EmojiProps {
  className?: string;
  label: string;
  symbol?: string;
  fallback?: string;
  type?: string;
}

const RenderEmoji = memo(
  ({ className, label, symbol, fallback, type }: EmojiProps) => {
    if (symbol === undefined && fallback === undefined) return null;
    if (type === "CreditCard" && symbol !== "0x1F501") {
      return (
        <span
          className={className}
          role="img"
          aria-label={label}
          style={{ position: "relative", left: "3px" }}
        >
          <Image
            className="rounded-[50%] mr-[8px]"
            src={"/icons/credit-card.png"}
            alt={"Investrio Logo"}
            width={20}
            height={20}
          />
        </span>
      );
    }
    if (label === DEBT_REPAYMENT_STRATEGY_NAME && symbol !== "0x1F501") {
      return (
        <span
          className={className}
          role="img"
          aria-label={label}
          style={{ position: "relative", left: "3px" }}
        >
          <Image
            className="rounded-[50%] mr-[8px]"
            src={"/logo.svg"}
            alt={"Investrio Logo"}
            width={20}
            height={20}
          />
        </span>
      );
    }
    return (
      <span className={className} role="img" aria-label={label}>
        {symbol
          ? String.fromCodePoint(symbol as any as number)
          : String.fromCodePoint(fallback as any as number)}
      </span>
    );
  }
);

export default RenderEmoji;
