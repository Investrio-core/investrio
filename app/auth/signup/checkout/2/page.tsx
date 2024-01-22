import Link from "next/link";

export default function Checkout2Page() {
  return (
    <div className="flex flex-col font-bold text-slate-500 max-w-[90%] mx-auto md:max-w-[400px] gap-x-5 gap-y-10">
      <p className="text-center">What's next?</p>
      <p>✅ Let’s get your debt under control. </p>
      <p>✅ We send a weekly newsletter and product updates. We promise not to spam you! </p>
      <p>✅ We’re excited to work with you, dream big. </p>

      <Link href={"/dashboard/"} className="btn btn-primary mt-4 w-full" type="submit">Get Started!</Link>
    </div>
  )
}