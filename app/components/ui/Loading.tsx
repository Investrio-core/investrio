import clsx from "clsx";

type LoadingProps = {
  size?: "xs" | "sm" | "m" | "lg";
  isHeightScreen?: boolean;
  border?: string;
};

export const Loading = ({
  size = "lg",
  isHeightScreen: hScreen = true,
  border = "border-purple-600",
}: LoadingProps) => {
  return (
    <div
      className={clsx("flex justify-center items-center", {
        "h-screen": hScreen,
      })}
    >
      <div
        className={clsx(
          "animate-spin rounded-full border-t-4 border-b-4",
          border,
          {
            "h-16 w-16": size === "lg",
            "h-10 w-10": size === "m",
            "h-6 w-6": size === "sm",
            "h-4 w-4": size === "xs",
          }
        )}
      ></div>
    </div>
  );
};
