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
        {/* <h1 className="uppercase mb-5">login</h1> */}
        <LoginForm />
        <div className="divider"></div>
        <div className="color-gray-200 text-left text-base">
          For the best Investrio experience, we suggest using a desktop.<br/> Good
          news: our mobile version is on its way!
        </div>
        {/* <p>Need an account? <Link href={"/auth/signup/individual/1"} className="font-bold">Sign Up</Link></p> */}
      </div>
    </div>
  );
}
