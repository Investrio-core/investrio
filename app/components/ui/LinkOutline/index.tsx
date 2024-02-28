import Link from "next/link";

import { twMerge } from "tailwind-merge";

interface IconLinkProps {
  className?: string;
  Icon: React.ComponentType;
  text: string;
  url: string;
}

const LinkOutline = ({ className, Icon, text, url }: IconLinkProps) => {
  return (
    <Link
      href={url}
      target="_blank"
      className={twMerge([
        "flex items-center gap-3",
        "font-bold text-[14px] leading-[15px]",
        "text-blue px-[14px] py-[5.5px]",
        "border border-blue rounded-[12px]",
        "h-fit hover:bg-slate-100",
        className
      ])}
    >
      <Icon />
      <div>{text}</div>
    </Link>
  );
};

export default LinkOutline;
