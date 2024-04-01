
import React from 'react'
import { Button } from '../ui/buttons'

type Props = {}

const CALENDLY_URL = "https://calendly.com/investrio-joyce";

const BookConsultationBlock = (props: Props) => {

  const onBookConsultationClick= () => {
    window.open(CALENDLY_URL)
  }
  return (
    <div className='rounded-xl py-4 w-full text-[15px] bg-gradient-to-br from-[#8740E2] to-[#F05DE2] text-white'>
      <div className='w-full px-4'> Do you want to </div>
      <div className='w-full px-4'>learn more about</div>
      <div className='w-full px-4'>Investrio?</div>

      <div className='w-full px-3 mt-6'>
      <Button onClick={onBookConsultationClick} text='Book consultation' classProp='!w-[144px] !p-2 !py-3 bg-white text-purple-3'/>
      </div>
      
    </div>
  )
}

export default BookConsultationBlock