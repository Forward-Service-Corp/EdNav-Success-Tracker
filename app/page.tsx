"use client";
import { useSession } from 'next-auth/react';
import SignIn from '@/components/sign-in';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Image
            className="mx-auto"
            src="/images/logo.png"
            width={160}
            height={160}
            alt="EDNAV"
            priority
          />
          <SignIn />
        </div>
      </div>
    );
  }

  redirect('/clients');
}
