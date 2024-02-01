"use client";
import { Button } from "./buttons";
import { post } from "@/utils/httpClient";

const deleteAll = async (userId: string) => {
  const res = await post(`/api/user/financials/${userId}`);
  location.reload();
};

export const DeleteButton = ({ userId }: { userId: string }) => {
  const handleDeleteButton = async () => {
    await deleteAll(userId);
  };

  return (
    <Button text="Delete all" classProp="!w-32" onClick={handleDeleteButton} />
  );
};
