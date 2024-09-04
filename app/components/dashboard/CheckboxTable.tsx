import { useEffect, useState } from "react";
import clsx from "clsx";
import { formatCurrency } from "@/app/utils/formatters";
import { AccountMonth, PaymentObject } from "@/app/hooks/calculatorsSnowball";
import Calender from "@/public/icons/calendar-styled.svg";

type Info = {
  id: number;
  label: string;
  subLabel: string;
  value1: number;
  value2: number;
  balanceStart: number;
  balanceEnd: number;
  paid: boolean;
  extraPaymentThisMonth: boolean;
  accruedInterest: number;
};

interface RepaymentShape {
  id: number;
  label: string;
  subLabel: string;
  value: number;
  value2: number;
  paid: boolean;
  extraPaymentThisMonth: number;
  accruedInterest: number;
}

export type CheckboxTableProps = {
  snowballResultsCurrentMonth?: PaymentObject[];
  _setPercentDown?: Function;
};

export const CheckboxTable = ({
  snowballResultsCurrentMonth,
  _setPercentDown,
}: CheckboxTableProps) => {
  const [list, setList] = useState<Info[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [percentDown, setPercentDown] = useState<string>("0");

  const handleCheckBoxChange = (id: number) => {
    let totalBalance = 0;
    let totalBalanceEnd = 0;
    const newList = list.map((info) => {
      totalBalance += info?.balanceStart;

      if (info.id !== id) {
        totalBalanceEnd += info?.paid
          ? info.balanceEnd
          : info.balanceStart + info.accruedInterest;
      }

      if (info.id === id) {
        totalBalanceEnd += info?.paid
          ? info.balanceStart + info.accruedInterest
          : info.balanceEnd;
        return { ...info, paid: !info.paid };
      }

      return info;
    });

    setTotalBalance(totalBalanceEnd);
    const percentDown = (
      ((totalBalance - totalBalanceEnd) / totalBalance) *
      100
    ).toFixed(2);
    setPercentDown(percentDown);
    _setPercentDown && _setPercentDown(percentDown);
    setList(newList);
  };

  const reshapeList = (snowballResultsCurrentMonth?: AccountMonth[]) => {
    if (snowballResultsCurrentMonth === undefined) return [];

    let totalBalance = 0;
    let totalBalanceEnd = 0;
    const reshapedList =
      snowballResultsCurrentMonth?.map((info, idx) => {
        const paid = list?.find((el) => el.label === info.name)?.paid || false;
        totalBalance += info?.balanceStart;
        totalBalanceEnd += paid
          ? info.balanceEnd
          : info.balanceStart + info.accruedInterest;

        return {
          label: info.name,
          paid: paid,
          value1: info.minPayment + info.additionalPayment,
          value2: info.balanceEnd,
          balanceStart: info.balanceStart,
          balanceEnd: info.balanceEnd,
          extraPaymentThisMonth: info.additionalPayment !== 0,
          subLabel: "Credit Card",
          id: idx,
          accruedInterest: info?.accruedInterest ?? 0,
        };
      }) ?? [];

    setTotalBalance(totalBalanceEnd);
    const percentDown = (
      ((totalBalance - totalBalanceEnd) / totalBalance) *
      100
    ).toFixed(2);
    setPercentDown(percentDown);
    _setPercentDown && _setPercentDown(percentDown);

    setList(reshapedList);
  };

  useEffect(() => {
    reshapeList(snowballResultsCurrentMonth);
  }, [snowballResultsCurrentMonth]);

  useEffect(() => {
    reshapeList(snowballResultsCurrentMonth);
  }, []);

  const balanceDecreasing = Number(percentDown) > 0;

  return (
    <div className="rounded-lg w-full flex flex-col justify-start p-8 py-2 lg:py-3 lg:py-4 h-full bg-white">
      <div className="mb-[8px] flex justify-start items-center gap-[8px]">
        <div className="w-9 h-5 inline-flex relative self-center justify-self-center mr-[4px]">
          <Calender />
        </div>
        <div className="text-[#2b3674] font-medium leading-loose self-center justify-self-center mt-[20px]">
          Repayment Strategy
        </div>
      </div>

      <div className="w-[100%] h-[39px] justify-between items-center inline-flex mb-[14px]">
        <div className="flex flex-col gap-[4px]">
          <div className="text-black-500 text-sm font-medium leading-normal">
            Total Debt
          </div>
          <div className="text-[#a3aed0] text-xs font-medium leading-normal">
            Month over Month
          </div>
        </div>
        <div className="flex-col justify-start items-end inline-flex">
          <div className="text-right text-[#2b3674] text-base font-bold leading-tight">
            {formatCurrency(totalBalance)}
          </div>
          <div className="justify-start items-center gap-1 inline-flex">
            <div className="w-5 h-5 relative" />
            <div
              className={`text-center ${
                balanceDecreasing ? "text-[#05cd99]" : "text-red-500"
              } text-xs font-bold leading-tight`}
            >
              {balanceDecreasing ? `+${percentDown}` : `${percentDown}`}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-[8px] font-semibold">
        <p>Payment Priority List</p>
        <p className="text-gray-400">
          {list &&
            list?.filter &&
            list?.length &&
            list.filter((l) => l.paid).length}
          /{list && list.length} done
        </p>
      </div>
      {list?.map((info, index) => {
        return (
          <div
            key={info.label + info.value2}
            className={clsx({
              "line-through text-gray-400": info.paid,
            })}
          >
            <hr className="bg-grey-400" />
            <div className="flex justify-between my-4">
              <div className="flex items-center">
                <input
                  className="checkbox checkbox-primary"
                  type="checkbox"
                  onChange={() => handleCheckBoxChange(index)}
                />

                <div className="ml-4 flex flex-row justify-between items-stretch whitespace-nowrap">
                  {info?.extraPaymentThisMonth ? (
                    <div className="h-[26px] ml-[4px] mr-[36px] px-3 py-1 bg-[#ff3333] rounded-[5px] justify-center items-center inline-flex">
                      <div className="text-white text-xs font-normal leading-[18px]">
                        Extra
                      </div>
                    </div>
                  ) : (
                    <div className="h-[26px] ml-[4px] mr-[12px] px-3 py-1 bg-[#8833ff] rounded-[5px] justify-center items-center inline-flex">
                      <div className="text-white text-xs font-normal  leading-[18px]">
                        Minimum
                      </div>
                    </div>
                  )}
                  <span className="text-lg font-semibold leading-7">
                    {info.label}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex flex-col justify-start items-start">
                <span className="text-lg font-semibold leading-7">
                  {formatCurrency(info.value1)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
