"use client";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { Button } from ".";

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
