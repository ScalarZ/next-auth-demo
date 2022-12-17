import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { FormEvent, useRef } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

const Signin = () => {
  const email = useRef<HTMLInputElement>(null);

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.current?.value) return;

    await fetch("api/auth/signin", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ strategy: "database" }),
    });

    const data = await signIn("email", {
      email: email.current?.value,
    });

    console.log(data);
  };
  return (
    <div>
      <h1 className="py-4 text-3xl font-bold text-center">SignIn</h1>
      <div className="space-y-2 flex justify-center items-center">
        <form
          className="w-72 p-6 border border-white rounded-xl flex flex-col gap-y-4"
          onSubmit={handleForm}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Email
            </label>
            <input
              ref={email}
              type="text"
              name="email"
              placeholder="Enter your email"
              className="mt-1 w-full p-2 text-lg text-stone-300 border border-stone-800 rounded bg-transparent flex justify-center items-center gap-x-2"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-lg text-stone-300 font-medium border border-stone-800 rounded flex justify-center items-center gap-x-2"
          >
            <span>Sign in with Email</span>
          </button>
          <button
            className="p-2 text-lg text-stone-300 font-medium border border-stone-800 rounded flex justify-center items-center gap-x-2"
            onClick={async () => {
              await fetch("api/auth/signin", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({ strategy: "jwt" }),
              });
              signIn("google");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="20"
              height="20"
              x="0"
              y="0"
              viewBox="0 0 210 210"
            >
              <path
                d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40
	c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105
	S0,162.897,0,105z"
                fill="#ffffff"
                data-original="#000000"
              ></path>
            </svg>
            <span>Sign in with Google</span>
          </button>
          <button
            className="p-2 text-lg text-stone-300 font-medium border border-stone-800 rounded flex justify-center items-center gap-x-2"
            onClick={async () => {
              await fetch("api/auth/signin", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({ strategy: "jwt" }),
              });
              signIn("github");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="20"
              height="20"
              x="0"
              y="0"
              viewBox="0 0 24 24"
            >
              <path
                d="m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z"
                fill="#ffffff"
                data-original="#000000"
              ></path>
            </svg>
            <span>Sign in with Github</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
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

export default Signin;
