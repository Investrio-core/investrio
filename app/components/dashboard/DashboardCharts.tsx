'use client';

import Card from "@/app/components/Card";
import { BsChevronRight } from "react-icons/bs";
import CustomLineChart from "@/app/components/charts/CustomLineChart";
import { lineDataMocked, MockedArea } from "@/app/components/charts/mocks";
import CustomPieChart from "@/app/components/charts/CustomPieChart";

export default function DashboardCharts() {
  return (
    <>
      <div className="md:col-span-6">
        <Card title="Accounts Balance">
          <div className="text-primary flex flex-row justify-between py-3 text-4xl">
            <h1>$ 60,950.00</h1>
            <BsChevronRight className="text-xl"/>
          </div>
        </Card>
      </div>
      <div className="md:col-span-6">
        <Card title="Total Networth">
          <div className="text-primary flex flex-row justify-between py-3 text-4xl">
            <h1>$ 60,950.00</h1>
            <BsChevronRight className="text-xl"/>
          </div>
        </Card>
      </div>
      <div className="md:col-span-7">
        <Card title="Income vs expenses">
          <CustomLineChart data={lineDataMocked} area={<MockedArea/>}/>
        </Card>
      </div>
      <div className="md:col-span-5">
        <Card title="Monthly budget breakdown">
          <CustomPieChart/>
        </Card>
      </div>
    </>
  )
}