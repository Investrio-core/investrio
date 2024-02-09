"use client";
import { Button } from "@/app/components/ui/buttons";
import { Steps } from "../../components/steps";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/app/lib/hooks/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/app/components/loading/Loading";
import { useRouter } from "next/navigation";
import { useRefreshToken } from "@/app/lib/hooks/useRefreshToken";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter()

  const axiosAuth = useAxiosAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", session?.user?.id],

    queryFn: async () =>
      await axiosAuth.get(`/user/dashboard/${session?.user?.id}`, {
        withCredentials: true,
      }),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    enabled: !!session?.user?.id,
  });

  if (isLoading || !session?.user?.id || !data) return <Loading />;

  const onEditClick = () => {
    router.push('/dashboard/debts/add?step=2')
  }

  return (
    <div className="m-2 mx-3  rounded-lg p-3 bg-white text-center">
      <div className="border-b-2 justify-between flex border-gray-100 p-3">
        <div>
          <h1 className="title text-left text-[#03091D]">Repayment Strategy</h1>
          <h2 className="text-left text-[#747682]">
            We do the hard work, so you can focus on what matters most.
          </h2>
        </div>
        {data?.data?.length ? <Button onClick={onEditClick} classProp={"!w-32 !h-12"} text="Edit" /> : null}
      </div>

      <Steps data={data.data}/>
    </div>
  );
}
