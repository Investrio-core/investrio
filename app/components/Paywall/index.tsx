'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import PaywallSubscription from '../Settings/PaywallSubscription'
import { redirect, usePathname } from 'next/navigation'

type Props = {}

const Paywall = (props: Props) => {
  const {data} = useSession()
  const path = usePathname()
  useEffect(() => {
    if (!path.startsWith('/dashboard')) {
      redirect('/dashboard/debts')
    }
  }, [])

  if (!data?.user.isShowPaywall) {
    return
  }

  return (
    <div className=' z-[1000] fixed top-0 left-0 w-full h-full overflow-scroll sm:overflow-hidden backdrop-blur-sm flex sm:items-center justify-center '>
      <div className='w-full h-full absolute bg-black opacity-50 '></div>
      <div className='max-sm:m-auto align-center z-[10001] bg-white w-full sm:w-[600px] backdrop-blur rounded-xl'>
        <PaywallSubscription data={data.user}/>
      </div>
    </div>
  )
}

export default Paywall