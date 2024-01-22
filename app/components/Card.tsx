import { PropsWithChildren } from "react";
import clsx from "clsx";

type CardProps = {
  title: string;
  fullWidth?: boolean;
};
export default function Card(props: PropsWithChildren<CardProps>) {
  return (
    <div
      className={clsx("card bg-white p-3", {
        "w-full": props.fullWidth,
      })}
    >
      <div className="text-sm font-semibold text-slate-600">{props.title}</div>
      <div>{props.children}</div>
    </div>
  );
}
