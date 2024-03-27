'use client';

import Form from "@/app/components/ui/Form";
import Input from "@/app/components/ui/Input";
import { useState } from "react";
import SigninButton from "@/app/components/ui/buttons/GoogleSignInButton";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Mixpanel from "@/services/mixpanel";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Individual1Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(data: { name: string; email: string; password: string }) {
    try {
      if (data.password.length < 8) {
        setError('Your password must be at least 8 characters long.');
        return;
      }

      setIsLoading(true)
      setError('');
      const user = await axios.post(`${API_URL}/user/signup`, {...data, type: 'credentials' }, {withCredentials: true});
  
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard/debts/add",
      })

      Mixpanel.getInstance().identify(user.data.id)
      Mixpanel.getInstance().set("$email", data.email)
      Mixpanel.getInstance().set("$name", data.name)
      
      Mixpanel.getInstance().track('registration')
    } catch (err: AxiosError | any) {
      console.log(err.message);
      setError(err.response.data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Input label="Your Full Name" name="name" required placeholder="Enter your full name"/>
        <Input label="Email address" name="email" required placeholder="Enter your email address" type="email"/>
        <Input label="Create password" name="password" required placeholder="Enter your password" type="password"/>

        {error && <p className="text-left text-sm text-red-500">{error}</p>}

        <div className="form-control w-fit mt-4">
          <label className="label cursor-pointer">
            <input type="checkbox" defaultChecked className="checkbox checkbox-primary mr-2"/>
            <span className="label-text">I agree to terms & conditions</span>
          </label>
        </div>

        <button className="btn btn-primary mt-4 w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Register Account'}
        </button>
      </Form>
      <div className="divider text-xs">Or</div>
      <SigninButton/>
      <p className="mt-5 text-center text-base">Already have an account? <Link href={"/auth/login"} className="font-bold text-purple-1">Sign in</Link></p>
    </>
  )
}