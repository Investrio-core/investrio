import AnimatedDropdownMenu, { OptionType } from "./ui/AnimatedDropdownMenu";
import { FiFilePlus, FiCalendar, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import {
  Building,
  DiamondPlus,
  FolderSync,
  Landmark,
  Calendar,
  LogOut,
} from "lucide-react";
import { IconType } from "react-icons";
import usePlaidLinks from "../hooks/plaid/usePlaidLinks";
import { useRouter } from "next/navigation";
interface Props {}
import PlaidLogo from "./PlaidOrManualSelector/PlaidLogo";
import PlaidSvg from "/public/icons/plaid-icon.svg";
import { useTabContext } from "../context/TabContext/context";

const openLinkNewTab = (url: string) => {
  const newTab = window.open(url, "_blank", "noopener,noreferrer");
  if (newTab) newTab.opener = null;
};

const OPTIONS: OptionType = [
  {
    label: "Book Consultation",
    icon: Calendar,
    onClick: () => openLinkNewTab("https://calendly.com/investrio-joyce"),
  },
  { label: "Logout", icon: LogOut, onClick: () => signOut() },
];

interface Props {
  name: string;
  email: string;
  image?: string;
  buttonContent?: JSX.Element;
  className?: string;
  outerClassName?: string;
}

export default function TopbarDropdown({
  name,
  email,
  image,
  buttonContent,
  className,
  outerClassName,
}: Props) {
  const { plaidLinks } = usePlaidLinks();
  const { push } = useRouter();
  const { setShowPlaidConnect } = useTabContext();

  let options = OPTIONS;

  if (plaidLinks?.data?.success?.length > 0) {
    const extraOptionsData = plaidLinks?.data?.success?.map((account) => {
      return {
        label: account.institutionName,
        icon: Landmark,
      };
    });
    const addAnother = {
      label: "Add Another Account",
      icon: DiamondPlus,
      addDividerAfter: true,
      onClick: () => setShowPlaidConnect(true),
    };
    options = [
      {
        label: "Plaid Connected Accounts",
        icon: () => <PlaidLogo width={20} height={20} />,
        customStyles: "bg-indigo-100 text-indigo-500"
      },
      ...extraOptionsData,
      addAnother,
      ...OPTIONS,
    ];
  } else {
    const addAnother = {
      label: "Plaid Connect Account",
      icon: () => <PlaidLogo width={20} height={20} />,
      addDividerAfter: true,
      onClick: () => setShowPlaidConnect(true),
    };
    options = [addAnother, ...OPTIONS];
  }

  const _buttonContent = (
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
      menuIcon={buttonContent ?? _buttonContent}
      options={options}
      renderImage={false}
      // imageUrl={image}
      className={className}
      outerClassName={outerClassName}
      renderChevron={false}
      fontSize={"1rem"}
    />
  );
}
