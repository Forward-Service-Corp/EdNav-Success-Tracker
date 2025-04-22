'use client';
import React, { useEffect, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import NavigatorSelector from '/components/NavigatorSelector';
import { useFepsLeft } from '../contexts/FepsLeftContext';
import { useEditing } from '../contexts/EditingContext';
import { useNavigators } from '../contexts/NavigatorsContext';
import { useSession } from 'next-auth/react';
import { SignOutButton } from './sign-out';
import SignInButton from './sign-in';
import Logo from './Logo';

export default function LeftNavEntire() {
  const { selectedNavigator } = useNavigators();
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();
  const { setEditing } = useEditing();
  const [, setMenuData] = useState([]);
  const navStatus = [
    [
      'All',
      'all',
      'bg-base-300 shadow-lg',
      'hover:bg-base-200'
    ], [
      'Active',
      'active',
      'bg-success shadow-lg',
      'hover:bg-success'
    ], [
      'Inactive',
      'inactive',
      'bg-error shadow-lg',
      'hover:bg-error'
    ],
    [
      'In Progress',
      'in-progress',
      'bg-warning shadow-lg',
      'hover:bg-warning'
    ],
    [
      'graduated',
      'graduated',
      'bg-info shadow-lg',
      'hover:bg-info'
    ]

  ];
  const navAgeGroup = ['All', 'Adult', 'Youth'];
  const getGroupedClients = async () => {
    const clients = await fetch(`/api/clients?grouped=true&navigator=${selectedNavigator?.name}`);
    const data = await clients.json();
    await setMenuData(data);
  };
  const session = useSession();
  useEffect(() => {
    getGroupedClients().then();
  }, []);

  return (
    <div
      className={`flex flex-col h-full justify-start pb-8 gap-2 no-scrollbar overflow-y-scroll relative whitespace-nowrap`}>
      <div className={`top-bars shadow bg-info/20`}>
        <Logo />
      </div>

      <div className={`flex flex-col justify-center  my-6`}>
        <ul className="menu menu-vertical rounded bg-base-100 mb-6 mx-5 w-[160px]">
          {
            navStatus.map((item, i) => (
              <li className={`mb-1 whitespace-nowrap`} key={i}>
                <a onClick={() => setSelectedFepLeft((prevState) => {
                  return {
                    ...prevState,
                    status: item[0]
                  };
                })}
                   className={`${item[3]} capitalize ${selectedFepLeft.status === item[0] || selectedFepLeft.status === '' ? item[2] : ''}`}>
                  {item[0]}
                </a>
              </li>
            ))
          }
        </ul>
        <ul className="menu menu-vertical bg-base-100 rounded mb-6 mx-6 w-[160px]">
          {
            navAgeGroup.map((item, i) => (
              <li className={`mb-1`} key={i}>
                <a onClick={() => setSelectedFepLeft(prevState => {
                  return {
                    ...prevState,
                    age: item
                  };
                })}
                   className={`hover:bg-base-200 ${selectedFepLeft.age === item ? 'bg-base-300 text-base-content shadow-lg' : ''}`}>{item}</a>
              </li>
            ))
          }
        </ul>
        <ul className="menu menu-vertical bg-base-100 rounded mb-4 mx-6 w-[160px]">
          <li>
            <a onClick={() => {
              setEditing('add-client');
            }}
               className={`hover:bg-base-200 `}>Add New Client +</a>
          </li>
          <li>
            <a href={`/dashboard/admin-tools`}
               className={`hover:bg-base-200 `}>Settings</a>
          </li>
        </ul>
      </div>
      <div className={`mb-2`}>

        <div className={`flex flex-col mt-8  bg-base-200  mx-6 w-[160px]`}>
          {session?.data?.user?.level !== 'navigator' ? <NavigatorSelector /> : null}
          <ThemeSwitcher />
          <div className={` whitespace-nowrap`}>{session?.data?.user?.name}</div>
          {/*<div className={` whitespace-nowrap`}>{session?.data?.user?.email}</div>*/}
          <div className={` mb-4 whitespace-nowrap`}>{session?.data?.user?.level}</div>
          {session?.status === 'authenticated' ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>

    </div>);
}
