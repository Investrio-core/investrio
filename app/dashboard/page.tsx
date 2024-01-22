import Card from "@/app/components/Card";
import { BsChevronRight } from "react-icons/bs";
import RecentTransactionsTable from "@/app/components/dashboard/RecentTransactionsTable/RecentTransactionsTable";
import DashboardCharts from "@/app/components/dashboard/DashboardCharts";
import { getServerSideUserId } from "@/utils/userIdServerSide";
import { getServerSide } from "@/utils/serverSideHttpClient";
import { redirect } from "next/navigation";

const getDashboardData = async (userId: string) => {
  const response = await getServerSide(`/api/user/${userId}?graph=dashboard`);

  if (!response?.length) {
    redirect('/dashboard/debts/add')
  }

  return response;
}

export default async function DashboardPage() {
  const userId = getServerSideUserId();
  const dashboardData = await getDashboardData(userId);

  if (dashboardData) {
    redirect('/dashboard/debts')
  }

  return (
    <div className="mx-auto max-w-[90%] py-5 md:max-w-[98%]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div
          className="card from-primary flex flex-col items-center justify-between bg-gradient-to-r to-[#9681FE] px-3 py-5 text-white md:col-span-12 md:flex-row">
          <h1 className="pb-3 text-2xl font-bold md:pb-0">Financial Goals</h1>
          <div className="flex flex-col gap-5 md:flex-row">
            <button className="btn btn-outline btn-sm px-10 text-white">
              Lower taxes
            </button>
            <button className="btn btn-outline btn-sm px-10 text-white">
              Retirement
            </button>
            <button className="btn btn-outline btn-sm px-10 text-white">
              Improve credit
            </button>
          </div>
        </div>
        <div className="md:col-span-6">
          <Card title="Accounts Balance">
            <div className="text-primary flex flex-row justify-between py-3 text-4xl">
              <h1>$ 60,950.00</h1>
              <BsChevronRight className="text-xl"/>
            </div>
          </Card>
        </div>
        <DashboardCharts/>
        <div className="col-span-1 md:col-span-12">
          <RecentTransactionsTable/>
        </div>
      </div>
    </div>
  );
}
