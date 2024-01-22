"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Tab } from "@headlessui/react";
import { ChooseMethods } from "@/app/components/steps/choose-methods";
import AddDebts from "@/app/components/steps/add-debts";
import { PaymentConfiguration } from "@/app/components/steps/payment-configuration";
import { Loading } from "@/app/components/loading/Loading";
import { twMerge } from "tailwind-merge";

export default function DebtsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [status, setStatus] = useState("choose-methods");
  const { data: session } = useSession();

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

  useEffect(() => {
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

  if (!session?.user?.id) return <Loading/>;

  return (
    <>
      <div className="m-2 mx-3 rounded-lg p-3 bg-white text-center">
        <div className="border-b-2 border-gray-100 p-3">
          <h1 className="title text-left text-[#03091D]">Add Information</h1>
          <h2 className="text-left text-[#747682]">
          We do the hard work, so you can focus on what matters most.
          </h2>
        </div>

        <Tab.Group selectedIndex={selectedTab}>
          <Tab.List className="hidden md:flex justify-evenly md:w-[600px] lg:w-[900px] xl:w-[1200px] mx-auto">
            {categories.map((category, index) => {
              return (
                <Tab disabled={index > selectedTab} className="disabled:cursor-not-allowed max-w-[800px]" key={category?.id}
                     onClick={() => handleTabSelect(index)}>
                  <div
                    className="relative flex flex-col items-center justify-center pb-8 text-[#8833FF] outline-0 disabled:cursor-not-allowed">
                    {selectedTab === index && (
                      <img
                        alt="Current step"
                        className="absolute mb-12 w-6 h-6"
                        src="/images/dashboard/arrow_down.svg"
                      />
                    )}
                    <div className="flex flex-col items-center pt-12">
                      <div className="relative flex items-center">
                        <span
                          className={twMerge(
                            `z-50 rounded-full h-8 w-8 text-sm font-light flex justify-center items-center`,
                            selectedTab >= index ? "bg-purple text-white" : "bg-[#F5F5F5] text-[#747682]"
                          )}
                        >
                          {category?.id}
                        </span>
                        <hr
                          className={twMerge(
                            "absolute z-10 mx-auto overflow:hidden ",
                            category.id <= selectedTab ? "border-purple" : "",
                            index < categories.length - 1 ? "md:w-[150px] lg:w-[220px] xl:w-[285px]" : ""
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
            <Tab.Panel><ChooseMethods onChangeStatus={setStatus}/></Tab.Panel>
            <Tab.Panel><AddDebts onChangeStatus={setStatus}/></Tab.Panel>
            <Tab.Panel>
              <PaymentConfiguration userId={session?.user?.id}/>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}
