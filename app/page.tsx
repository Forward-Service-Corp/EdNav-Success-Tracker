"use client";
import { useSession } from "next-auth/react";
import PerfectLayout from "../components/PerfectLayout";
import SignIn from "@/components/sign-in";
import Image from "next/image";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Image src="/images/logo.png" width={160} height={160} alt="EDNAV" />
          <SignIn />
        </div>
      </div>
    );
  }

  return <PerfectLayout />;
}
