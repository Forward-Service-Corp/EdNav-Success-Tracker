"use client";
import { useSession } from 'next-auth/react';
import SignIn from '@/components/sign-in';
import { redirect } from 'next/navigation';

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
        <div className="text-center relative">
          <div
            className={`absolute -top-[164px] -left-1/4 z-50 flex items-center justify-center w-[164px] h-[164px] bg-base-300 rounded-full`}>
            <div className={`text-[150px] antialiased -tracking-[4px] font-bold italic relative flex`}><span
              className={`text-primary z-20 inline-block`}>E</span><span
              className={`text-secondary -ml-8 z-0 inline-block`}>N</span></div>
          </div>
          {/*<Image*/}
          {/*  className="mx-auto"*/}
          {/*  src="/images/logo.png"*/}
          {/*  width={160}*/}
          {/*  height={160}*/}
          {/*  alt="EDNAV"*/}
          {/*  priority*/}
          {/*/>*/}
          <SignIn />
        </div>
      </div>
    );
  }

  redirect('/clients');
}
