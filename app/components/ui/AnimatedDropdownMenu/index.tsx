import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiPlusSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { IconType } from "react-icons";
import Image from "next/image";

export type OptionType = { label: string; icon: IconType; onClick: Function }[];

interface Props {
  options: { label: string; icon: IconType; onClick: Function }[];
  menuTitle: string;
  menuIcon?: React.ReactElement;
  renderImage: boolean;
  imageUrl?: string;
}

const AnimatedDropdownMenu = ({
  menuTitle,
  menuIcon,
  imageUrl,
  renderImage,
  options,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center bg-white relative z-100">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((pv) => !pv)}
          className="border-b-[1px] border-r-[1px] border border-grey-200 max-w-fit relative flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-violet-50 hover:bg-violet:500 transition-colors shadow-md"
        >
          {renderImage ? (
            <Image
              className="rounded-[50%]"
              src={imageUrl || "/logo.svg"}
              alt={"menu button open image"}
              width={30}
              height={30}
            />
          ) : null}
          {menuIcon ?? null}
          {menuTitle ? (
            <span className="font-medium text-sm text-white font-bold">
              {menuTitle}
            </span>
          ) : null}
          <motion.span variants={iconVariants}>
            <FiChevronDown className={"text-slate-600"} />
          </motion.span>
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden z-100"
        >
          {options.map(({ onClick, label, icon }) => (
            <Option onClick={onClick} text={label} Icon={icon} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

interface OptionProps {
  text: string;
  Icon: IconType;
  onClick: Function;
}

const Option = ({ text, Icon, onClick }: OptionProps) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => onClick()}
      className="relative z-100 flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default AnimatedDropdownMenu;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
