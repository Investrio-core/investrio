import { DEBT_REPAYMENT_STRATEGY_NAME } from "@/app/dashboard/budget/components/BudgetTool";
import { memo } from "react";
import Image from "next/image";

interface EmojiProps {
  className?: string;
  label: string;
  symbol?: string;
  fallback?: string;
}

const RenderEmoji = memo(
  ({ className, label, symbol, fallback }: EmojiProps) => {
    if (symbol === undefined && fallback === undefined) return null;
    if (label === DEBT_REPAYMENT_STRATEGY_NAME && symbol !== "0x1F501") {
      return (
        <span className={className} role="img" aria-label={label}>
          <Image
            className="rounded-[50%] mr-[8px]"
            src={"/logo.svg"}
            alt={"Investrio Logo"}
            width={24}
            height={20.72}
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
