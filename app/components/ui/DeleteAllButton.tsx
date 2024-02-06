"use client";
import useAxiosAuth from "@/app/lib/hooks/useAxiosAuth";
import { Button } from "./buttons";
import { post } from "@/utils/httpClient";

export const DeleteButton = ({ userId }: { userId: string }) => {
  const axiosAuth = useAxiosAuth()

  const handleDeleteButton = async () => {
    const res = await axiosAuth.delete(`/user/strategy/deleteAll`);
    location.reload();
  };

  return (
    <Button text="Delete all" classProp="!w-32" onClick={handleDeleteButton} />
  );
};
