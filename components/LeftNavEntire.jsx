"use client";
import React, { useEffect, useState } from "react";
import { useFepsLeft } from "../contexts/FepsLeftContext";
import { useEditing } from "../contexts/EditingContext";
import { useNavigators } from "../contexts/NavigatorsContext";
import { useSession } from "next-auth/react";

export default function LeftNavEntire() {
  const { selectedNavigator } = useNavigators();
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();
  const { setEditing } = useEditing();
  const [, setMenuData] = useState([]);
  const navStatus = [
    ["All", "all", "bg-base-300 shadow-lg", "hover:bg-base-200"],
    ["Active", "active", "bg-success shadow-lg", "hover:bg-success"],
    ["Inactive", "inactive", "bg-error shadow-lg", "hover:bg-error"],
    ["In Progress", "in-progress", "bg-warning shadow-lg", "hover:bg-warning"],
    ["graduated", "graduated", "bg-info shadow-lg", "hover:bg-info"],
  ];
  const navAgeGroup = ["All", "Adult", "Youth"];
  const getGroupedClients = async () => {
    const clients = await fetch(
      `/api/clients?grouped=true&navigator=${selectedNavigator?.name}`,
    );
    const data = await clients.json();
    await setMenuData(data);
  };
  const handleClick = (e, item) => {
    e.preventDefault();
    setSelectedFepLeft((prevState) => {
      return {
        ...prevState,
        status: item[0],
      };
    });
  };
  const session = useSession();
  useEffect(() => {
    getGroupedClients().then();
  }, []);

  return (
    <div className={``}>
      {/*<ul className="menu bg-base-200 rounded-box w-56">*/}
      {/*  {*/}
      {/*    navStatus.map((item, i) => (*/}
      {/*      <li key={i}><a data-value={item[i]} onClick={handleClick}>Item 1</a></li>*/}
      {/*    ))*/}
      {/*  }*/}
      {/*</ul>*/}

      {/*<div className={`flex flex-col`}>*/}
      {/*  <ul className="menu menu-vertical rounded bg-base-200 mb-6 w-full p-2">*/}

      {/*  </ul>*/}
      {/*  <ul className="menu menu-vertical bg-base-200 rounded  mb-4 min-w-[220px]">*/}
      {/*    {*/}
      {/*      navAgeGroup.map((item, i) => (*/}
      {/*        <li className={`mb-1`} key={i}>*/}
      {/*          <a onClick={() => setSelectedFepLeft(prevState => {*/}
      {/*            return {*/}
      {/*              ...prevState,*/}
      {/*              age: item*/}
      {/*            };*/}
      {/*          })}*/}
      {/*             className={`py-3 px-3 text-[14px] hover:bg-base-200 ${selectedFepLeft.age === item ? 'bg-base-300 text-base-content shadow-lg' : ''}`}>{item}</a>*/}
      {/*        </li>*/}
      {/*      ))*/}
      {/*    }*/}
      {/*  </ul>*/}
      {/*  <ul className="menu menu-vertical bg-base-100 rounded mb-4 mx-6 w-[160px]">*/}
      {/*    <li>*/}
      {/*      <a onClick={() => {*/}
      {/*        setEditing('add-client');*/}
      {/*      }}*/}
      {/*         className={`hover:bg-base-200 `}>Add New Client +</a>*/}
      {/*    </li>*/}
      {/*    <li>*/}
      {/*      <a href={`/dashboard/admin-tools`}*/}
      {/*         className={`hover:bg-base-200 `}>Settings</a>*/}
      {/*    </li>*/}
      {/*  </ul>*/}
      {/*</div>*/}
      {/*<div className={`mb-2`}>*/}

      {/*  <div className={`flex flex-col mt-8  bg-base-200  mx-6 w-[160px]`}>*/}
      {/*    {session?.data?.user?.level !== 'navigator' ? <NavigatorSelector /> : null}*/}
      {/*    <ThemeSwitcher />*/}
      {/*    <div className={` whitespace-nowrap`}>{session?.data?.user?.name}</div>*/}
      {/*    /!*<div className={` whitespace-nowrap`}>{session?.data?.user?.email}</div>*!/*/}
      {/*    <div className={` mb-4 whitespace-nowrap`}>{session?.data?.user?.level}</div>*/}
      {/*    {session?.status === 'authenticated' ? <SignOutButton /> : <SignInButton />}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
