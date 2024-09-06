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
  className?: string;
  outerClassName?: string;
  renderChevron?: boolean;
}

const AnimatedDropdownMenu = ({
  menuTitle,
  menuIcon,
  imageUrl,
  renderImage,
  options,
  className,
  outerClassName,
  renderChevron,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={
        `${outerClassName} relative flex items-center justify-center` ??
        "flex items-center justify-center bg-white relative"
      }
    >
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((pv) => !pv)}
          className={
            className ??
            "border-b-[1px] border-r-[1px] border border-grey-200 max-w-fit relative flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50 bg-violet-50 hover:bg-violet:500 transition-colors md:shadow-md"
          }
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
          {renderChevron ? (
            <motion.span variants={iconVariants}>
              <FiChevronDown className={"text-slate-600"} />
            </motion.span>
          ) : null}
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{
            originY: "top",
            translateX: "-90%",
            translateY: "5%",
          }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] right-34 w-34"
        >
          {options.map(({ onClick, label, icon }) => (
            <Option key={label} onClick={onClick} text={label} Icon={icon} />
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
      key={text}
      variants={itemVariants}
      onClick={() => onClick()}
      className="relative flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
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
    zIndex: 1000,
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    zIndex: 0,
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
