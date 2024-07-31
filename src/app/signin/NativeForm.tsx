'use client'

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function NativeForm() {
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;

        console.log(email, password)

        const isValidEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (!isValidEmail(email)) {
            setError("Email is invalid!");
            return;
        }

        if (!password || password.length < 6) {
            setError("Password is invalid!");
            return;
        }

        const res = await signIn('credentials', {
            email,
            password,
        })

        if (res?.error) {
            setError('Invalid email or password!');
            if (res?.url) router.replace('/dashboard');
        } else {
            setError("");
            router.push("/");
        }
    };


    return (
        <div className="flex flex-col min-h-screen items-center justify-between p-24">
            <div className="bg-[#212121] p-8 rounded shadow-md w-96">
                <h1 className="text-xl text-white text-center font-semibold mb-8">
                    Login
                </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-[#363636] text-white text-md p-2 rounded mb-4"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-[#363636] text-white text-md p-2 rounded mb-4"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full text-white py-2 mt-5 rounded-md bg-slate-500 hover:bg-slate-700"
                    >
                        {" "}
                        Sign In
                    </button>

                    <div>
                        {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}


