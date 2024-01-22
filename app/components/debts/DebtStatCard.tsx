import { IconType } from "react-icons";

type SummaryCardProps = {
  title: string;
  icon?: IconType;
  description: string;
  extra?: string;
};

export default function DebtStatCard({
  title,
  icon: Icon,
  description,
  extra,
}: SummaryCardProps) {
  return (
    <div className="card flex-grow justify-center bg-white p-5">
      <div className="flex items-center">
        {Icon && (
          <Icon className="text-primary mr-2 h-[40px] w-[40px] rounded-full bg-[#F4F7FE] p-2" />
        )}
        <div>
          <h5 className="text-sm font-semibold">{title}</h5>
          <p className="text-primary mb-0">{description}</p>
          <p className="text-xs font-thin text-slate-400">{extra}</p>
        </div>
      </div>
    </div>
  );
}
