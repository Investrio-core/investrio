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
    <div className="flex flex-row">
      <div className="flex flex-row gap-2 bg-transparent lg:mr-4">
        <div className="mr-3 flex flex-col lg:mr-auto">
          <span className="text-sm text-white font-bold">
            {name?.split(" ")[0] || "username"}
          </span>
          {/* hidden sm:block */}
          {
            <span className="hidden sm:block text-[10px] text-slate-300">
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
