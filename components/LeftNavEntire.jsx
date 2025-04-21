'use client';
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import NavigatorSelector from '/components/NavigatorSelector';
import LeftNavigation from '/components/LeftNavigation';
import { useSession } from 'next-auth/react';
import { SignOutButton } from './sign-out';
import SignInButton from './sign-in';
import Logo from './Logo';

export default function LeftNavEntire({setEditing}) {
    const session = useSession();
    return (
      <div
        className={`flex flex-col h-full justify-start bg-base-300 px-4 pb-8 gap-2 z-50 no-scrollbar overflow-y-scroll relative whitespace-nowrap`}>
          <Logo />
          <LeftNavigation setEditing={setEditing} />

            <div className={`mb-2`}>
              {session?.data?.user?.level !== 'navigator' ? <NavigatorSelector /> : null}
                <ThemeSwitcher/>
              <div className={`flex flex-col mt-8 p-3 bg-base-200`}>
                <div className={`text-sm whitespace-nowrap`}>{session?.data?.user?.name}</div>
                <div className={`text-xs whitespace-nowrap`}>{session?.data?.user?.email}</div>
                <div className={`text-xs mb-4 whitespace-nowrap`}>{session?.data?.user?.level}</div>
                {session?.status === 'authenticated' ? <SignOutButton /> : <SignInButton />}
                </div>
            </div>

        </div>
);
}
