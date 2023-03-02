import React, { useRef } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";


const SignUp = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  async function handleSignUp() {
    if (
      !usernameRef.current?.value ||
      !emailRef.current?.value ||
      !passwordRef.current?.value
    )
      return;
    const { data, error } = await supabase.auth.signUp({
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      options: {
        data: {
          name: usernameRef.current.value,
        },
      },
    });
    if (error) return console.error(error);

    console.log(data);
  }
  return (
    <div>
      <h1 className="py-4 text-3xl font-bold text-center">Sign up</h1>
      <div className="space-y-2 flex justify-center items-center">
        <div className="w-72 p-6 border border-white rounded-xl flex flex-col gap-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Username
            </label>
            <input
              ref={usernameRef}
              type="text"
              name="username"
              placeholder="username"
              className="mt-1 w-full p-2 text-lg text-stone-300 border border-stone-800 rounded bg-transparent flex justify-center items-center gap-x-2"
            />
            <label
              htmlFor="email"
              className="mt-2 block text-lg font-medium text-white"
            >
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="email"
              className="mt-1 w-full p-2 text-lg text-stone-300 border border-stone-800 rounded bg-transparent flex justify-center items-center gap-x-2"
            />
            <label
              htmlFor="password"
              className="mt-2 block text-lg font-medium text-white"
            >
              Password
            </label>
            <input
              ref={passwordRef}
              type="text"
              name="password"
              placeholder="password"
              className="mt-1 w-full p-2 text-lg text-stone-300 border border-stone-800 rounded bg-transparent flex justify-center items-center gap-x-2"
            />
          </div>
          <button
            onClick={handleSignUp}
            type="submit"
            className="w-full p-2 text-lg text-stone-300 font-medium border border-stone-800 rounded flex justify-center items-center gap-x-2"
          >
            <span>Sign up</span>
          </button>
          <Link
            href="/signin"
            className="text-center font-medium text-blue-500"
          >
            Sing in
          </Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignUp;
