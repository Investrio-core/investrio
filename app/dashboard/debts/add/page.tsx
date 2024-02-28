"use client";
import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tab } from "@headlessui/react";
import { ChooseMethods } from "@/app/components/strategy/choose-methods";
import AddDebts from "@/app/components/strategy/add-strategy";
import { PaymentConfiguration } from "@/app/components/strategy/payment-configuration";
import { Loading } from "@/app/components/ui/Loading";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useSearchParams } from "next/navigation";

import ArrowDown from '@/public/icons/arrow_down.svg'

export default function DebtsPage() {
  const { data: session } = useSession();
  const params = useSearchParams()

  const axiosAuth = useAxiosAuth();
  const [debt, setDebts] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [status, setStatus] = useState("choose-methods");

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["extra-payments"],
    queryFn: async () =>
      await axiosAuth.get(`/user/records/${session?.user?.id}`),
    refetchOnMount: status !== "payment-config",
    refetchOnWindowFocus: status !== "payment-config",
    enabled: !!session?.user.id || status !== "payment-config",
  });

  if (!session?.user?.id) return <Loading />;

  let [categories] = useState([
    {
      id: 1,
      title: "Ready",
    },
    {
      id: 2,
      title: "Set",
    },
    {
      id: 3,
      title: "Go!",
    },
  ]);

  const handleTabSelect = (index: number) => {
    setSelectedTab(index);
    if (index === 0) return setStatus("choose-methods");
    if (index === 1) return setStatus("add-debts");
    if (index === 2) return setStatus("payment-config");
  };

  const handleTabHeaderTitle = () => {
    switch (status) {
      case 'choose-methods':
        return 'Get Started'
        break;

      case 'add-debts':
        return 'Add Information'
        break;

      case 'payment-config':
        return 'Discover how Investrio saves you money'
        break;
    
      default:
        break;
    }
  }

  const handleTabHeaderDescription = () => {
    switch (status) {
      case 'choose-methods':
        return 'We do the hard work, so you can focus on what matters most.'
        break;

      case 'add-debts':
        return 'The first step to creating a solid strategy is to assess your current financial situation. Please take a moment to enter your debts manually.'
        break;

      case 'payment-config':
        return 'We compared the results of your debt repayment with and without the Investrio method, and the difference is significant!'
        break;
    
      default:
        break;
    }
  }

  useEffect(() => {
    if (status !== "payment-config") {
      refetch();
    }
    if (status === "choose-methods") {
      setSelectedTab(0);
    }
    if (status === "add-debts") {
      setSelectedTab(1);
    }
    if (status === "payment-config") {
      setSelectedTab(2);
    }
  }, [status]);

  useEffect(() => {
    if (data?.data) {
      setDebts(data.data);
    }
  }, [isRefetching || isLoading]);

  useEffect(() => {
    const step = params.get('step')
    if (step) {
      handleTabSelect(1)
    }
  }, [])

  return (
    <>
      <div className="m-2 mx-3 rounded-lg p-3 bg-white text-center">
        <div className="border-b-2 border-gray-100 p-3">
          <h1 className="title text-left text-[#03091D]">{handleTabHeaderTitle()}</h1>
          <h2 className="text-left text-[#747682]">
          {handleTabHeaderDescription()}
          </h2>
        </div>

        <Tab.Group selectedIndex={selectedTab}>
          <Tab.List className="hidden md:flex justify-evenly md:w-[600px] lg:w-[900px] xl:w-[1200px] mx-auto">
            {categories.map((category, index) => {
              return (
                <Tab
                  disabled={data?.data.length > 0 ? false : index > selectedTab}
                  className="disabled:cursor-not-allowed max-w-[800px]"
                  key={category?.id}
                  onClick={() => handleTabSelect(index)}
                >
                  <div className="relative flex flex-col items-center justify-center pb-8 text-[#8833FF] outline-0 disabled:cursor-not-allowed">
                    {selectedTab === index && (
                      <ArrowDown className="absolute mb-12 w-6 h-6" />
                    )}
                    <div className="flex flex-col items-center pt-12">
                      <div className="relative flex items-center">
                        <span
                          className={twMerge(
                            `z-50 rounded-full h-8 w-8 text-sm font-light flex justify-center items-center`,
                            selectedTab >= index
                              ? "bg-purple text-white"
                              : "bg-[#F5F5F5] text-[#747682]"
                          )}
                        >
                          {category?.id}
                        </span>
                        <hr
                          className={twMerge(
                            "absolute z-10 left-7 mx-auto overflow:hidden ",
                            category.id <= selectedTab ? "border-purple" : "",
                            index < categories.length - 1
                              ? "md:w-[150px] lg:w-[220px] xl:w-[285px]"
                              : ""
                          )}
                        />
                      </div>

                      <span
                        className={`font-light whitespace-nowrap ${
                          selectedTab === index
                            ? "text-purple"
                            : "text-[#747682]"
                        }`}
                      >
                        {category.title}
                      </span>
                    </div>
                  </div>
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <ChooseMethods onChangeStatus={setStatus} />
            </Tab.Panel>
            <Tab.Panel>
              <AddDebts onChangeStatus={setStatus} records={debt} />
            </Tab.Panel>
            <Tab.Panel>
              <PaymentConfiguration userId={session?.user?.id} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}
