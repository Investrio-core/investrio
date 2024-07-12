import React from "react";
import { twMerge } from "tailwind-merge";
import "./styles.css";

type CardProps = {
  className?: string;
  hoverClassName?: string;
  onClick?: () => void;
  Icon: React.ComponentType;
  disabled?: boolean;
};

const IconButton = ({ className, onClick, Icon, disabled }: CardProps) => {
  return (
    <button
      className={twMerge(className, "iconButton")}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon />
    </button>
  );
};

export default IconButton;
