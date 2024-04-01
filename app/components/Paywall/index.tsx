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
    document.body.style.overflow = 'hidden'
    if (!path.startsWith('/dashboard')) {
      redirect('/dashboard/debts')
    }
  }, [])

  if (!data?.user.isShowPaywall) {
    document.body.style.overflow = 'unset'
    return
  }

  return (
    <div className=' z-[1000] absolute top-0 left-0 w-[100vw] h-[100vh] overflow-hidden backdrop-blur-sm flex items-center justify-center'>
      <div className='top-0 left-0 absolute w-full h-full bg-black opacity-50 '></div>
      <div className='z-[10001] bg-white w-[600px] backdrop-blur rounded-xl'>
        <PaywallSubscription data={data.user}/>
      </div>
    </div>
  )
}

export default Paywall