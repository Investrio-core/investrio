'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Error({
                                error,
                                reset,
                              }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();

  useEffect(() => {
    if (error.message === 'Unauthorized') {
      toast.warning('Your session has expired. Redirecting you to login...', {
        toastId: 'session-expired',
      });

      signOut().then(() => router.push('/auth/login?next=/dashboard/debts/dashboard'));
    }
  }, [error])

  return (
    <div className="mx-auto text-center">
      <h2>An error ocurred:</h2>
      <h3 className="text-error">{error.message}</h3>
      <button
        className="btn btn-sm"
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}