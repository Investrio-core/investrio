import { memo } from "react";

interface EmojiProps {
  className?: string;
  label: string;
  symbol?: string;
  fallback?: string;
}

const RenderEmoji = memo(
  ({ className, label, symbol, fallback }: EmojiProps) => {
    if (symbol === undefined && fallback === undefined) return null;

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
