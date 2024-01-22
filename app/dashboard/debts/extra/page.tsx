import Input from "@/app/components/forms/Input";
import DebtsNextButton from "@/app/dashboard/debts/extra/components/NextButton";

export default function DebtsExtraPage() {
  return (
    <div className="mx-auto py-10">
      <h1 className="text-center title mb-5">Tell us about your payments:</h1>
      <div className="card bg-white max-w-[90%] md:max-w-3xl mx-auto text-center p-5 flex flex-col gap-5 mb-5">
        <h2 className="font-semibold text-slate-700">Are you currently paying the minimum amount of $375.00 each
          month?</h2>
        <div className="flex gap-5 mx-auto">
          <div className="join ml-auto pt-1 md:p-0">
            <input className="join-item btn" type="radio" name="frequency" value="YES" aria-label="Yes"/>
            <input className="join-item btn" type="radio" name="frequency" value="NO" aria-label="No"/>
          </div>
        </div>

        <div className="text-center">
          <h2 className="md:max-w-[70%] mx-auto font-semibold text-slate-700">What's a comfortable additional amount you
            can add towards paying
            off your debt each month?</h2>
          <h3 className="font-thin text-sm">(We recommend a minimum of $100, but feel free to input any additional
            amount you would like)</h3>

          <div className="w-[150px] mx-auto">
            <Input label="" name="value" type="number"/>
          </div>
        </div>
      </div>
      <div className="max-w-[90%] md:max-w-5xl mx-auto text-center">
        <DebtsNextButton />
      </div>
    </div>
  )
}