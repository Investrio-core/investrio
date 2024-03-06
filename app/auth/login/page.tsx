import Image from "next/image";
import LoginForm from "@/app/auth/login/components/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div>
      <Image
        src="/logo.svg"
        alt="Investrio"
        width={80}
        height={77}
        className="mx-auto pb-5"
      />
      <div className="card bg-base-100 shadow p-5 text-center">
        <LoginForm />
        <p className="mt-[32px] text-base">Don’t have an account? <Link href={"/auth/signup"} className="font-bold text-purple-1">Register Here</Link></p>
        <div className="mt-[32px] text-[#6C7278] text-center text-base">
          For the best Investrio experience, we suggest using a desktop.<br/> Good
          news: our mobile version is on its way!
        </div>
      </div>
    </div>
  );
}
