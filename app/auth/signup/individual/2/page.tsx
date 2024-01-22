'use client';

import Form from "@/app/components/forms/Form";
import Input from "@/app/components/forms/Input";
import Select from "@/app/components/forms/Select";
import { FormEvent } from "react";
import Link from "next/link";

export default function Individual2Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(event);
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input label="Your Date of Birth" name="birth" type="date"/>

      <Select label="Gender"
              name="gender"
              options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }, {
                label: "Other",
                value: "other"
              }]}
      />

      <Link href={"/auth/signup/goals"} className="btn btn-primary mt-4 w-full" type="submit">Save & Continue</Link>
    </Form>
  )
}