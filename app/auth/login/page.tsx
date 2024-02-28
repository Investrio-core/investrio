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
        <div className="divider"></div>
        <div className="color-gray-200 text-left text-base">
          For the best Investrio experience, we suggest using a desktop.<br/> Good
          news: our mobile version is on its way!
        </div>
      </div>
    </div>
  );
}
