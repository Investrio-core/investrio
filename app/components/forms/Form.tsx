"use client";
import { FormEvent } from "react";

type FormProps = {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  id?: string;
  className?: string;
};

// TODO: change to useForm lib
export default function Form({ children, onSubmit, id, className }: FormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData);
    onSubmit(values);
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
