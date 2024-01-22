'use client';

import Form from "@/app/components/forms/Form";
import Input from "@/app/components/forms/Input";
import { useState } from "react";
import SigninButton from "@/app/components/SigninButton";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";

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
      await axios.post('/api/user', data);
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard/debts/add",
        // redirect: false,
      })
    } catch (err: AxiosError | any) {
      setError("An error ocurred. Please, try again later.")
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
    </>
  )
}