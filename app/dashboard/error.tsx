'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import dayjs from "dayjs";

export default function Error({
                                error,
                                reset,
                              }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "loading") return;

    const expired = session.status === "unauthenticated" || dayjs(session?.data?.expires).isAfter(dayjs())
    if (error.message === 'Unauthorized' || expired) {
      toast.warning('Your session has expired. Redirecting you to login...', {
        toastId: 'session-expired',
      });

      // signOut().then(() => router.push('/auth/login'));
    }
  }, [error, session])

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