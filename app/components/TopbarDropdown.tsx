import AnimatedDropdownMenu, { OptionType } from "./ui/AnimatedDropdownMenu";
import { FiLogOut } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { IconType } from "react-icons";
interface Props {}
//React.ComponentType

const openLinkNewTab = (url: string) => {
  const newTab = window.open(url, "_blank", "noopener,noreferrer");
  if (newTab) newTab.opener = null;
};

const OPTIONS: OptionType = [
  {
    label: "Book Consultation",
    icon: FiCalendar,
    onClick: () => openLinkNewTab("https://calendly.com/investrio-joyce"),
  },
  { label: "Logout", icon: FiLogOut, onClick: () => signOut() },
];

interface Props {
  name: string;
  email: string;
  image?: string;
}

export default function TopbarDropdown({ name, email, image }: Props) {
  const buttonContent = (
    <div className="flex flex-row z-100 relative">
      <div className="flex flex-row gap-2 bg-transparent lg:mr-4">
        <div className="mr-1 flex flex-col justify-start items-start lg:mr-auto">
          <span className="text-sm text-slate-600 font-bold">
            {name?.split(" ")[0] || "username"}
          </span>
          {
            <span className="hidden sm:block text-[10px] text-slate-400">
              {email}
            </span>
          }
        </div>
      </div>
    </div>
  );

  return (
    <AnimatedDropdownMenu
      menuTitle={""}
      menuIcon={buttonContent}
      options={OPTIONS}
      renderImage={true}
      imageUrl={image}
    />
  );
}
