'use client';
import { useRouter } from "next/navigation";

export default function DebtsNextButton() {
  const router = useRouter();
  return (
    <button
      className="btn btn-primary mx-auto w-80 mt-5"
      onClick={() => router.push('/dashboard/debts/dashboard')}
    >
      Next
    </button>
  )
}