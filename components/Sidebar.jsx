import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ChartPieIcon,
  FolderIcon,
  HomeIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Logo from "./Logo";
import NavigatorSelector from "./NavigatorSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import { useFepsLeft } from "../contexts/FepsLeftContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ setOpenPanel }) {
  const { setSelectedFepLeft } = useFepsLeft();

  const handleFilters = ({ name, val }) => {
    setSelectedFepLeft((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    {
      name: "Client Status",
      icon: UsersIcon,
      current: false,
      children: [
        {
          name: "All",
          onClick: () => handleFilters({ name: "status", val: "All" }),
        },
        {
          name: "Active",
          onClick: () => handleFilters({ name: "status", val: "Active" }),
        },
        {
          name: "In Progress",
          onClick: () => handleFilters({ name: "status", val: "In Progress" }),
        },
        {
          name: "Graduated",
          onClick: () => handleFilters({ name: "status", val: "Graduated" }),
        },
        {
          name: "Inactive",
          onClick: () => handleFilters({ name: "status", val: "Inactive" }),
        },
      ],
    },
    {
      name: "Age",
      icon: FolderIcon,
      current: false,
      children: [
        {
          name: "All",
          onClick: () => handleFilters({ name: "age", val: "All" }),
        },
        {
          name: "Adult",
          onClick: () => handleFilters({ name: "age", val: "Adult" }),
        },
        {
          name: "Youth",
          onClick: () => handleFilters({ name: "age", val: "Youth" }),
        },
      ],
    },
    {
      name: "Add a client",
      onClick: () => setOpenPanel("form"),
      icon: UserPlusIcon,
      current: false,
    },
    { name: "Logout", href: "/logout", icon: ChartPieIcon, current: false },
  ];
  const { data: session } = useSession();
  return (
    <div className="bg-base-200 z-20 flex h-screen flex-col gap-y-5 overflow-y-auto px-6 shadow-lg">
      <div className="flex h-[80px] shrink-0 items-center">
        <Logo />
        <div className="ml-auto">
          <button
            onClick={() => setOpenPanel(null)}
            className="btn btn-sm btn-ghost text-base-content hover:bg-base-300"
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <a
                      onClick={() => item.onClick}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current ? "bg-base-200" : "hover:bg-base-200",
                        "group text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="text-base-content/60 size-6 shrink-0"
                      />
                      {item.name}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      <DisclosureButton
                        className={classNames(
                          item.current ? "bg-base-200" : "hover:bg-base-200",
                          "group text-base-content flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold",
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className="text-base-content/60 size-6 shrink-0"
                        />
                        {item.name}
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="text-base-content/60 group-data-[open]:text-base-content/70 ml-auto size-5 shrink-0 group-data-[open]:rotate-90"
                        />
                      </DisclosureButton>
                      <DisclosurePanel as="ul" className="mt-1 px-2">
                        {item.children.map((subItem) => (
                          <li key={subItem.name}>
                            {/* 44px */}
                            <DisclosureButton
                              as="a"
                              href={subItem.href}
                              className={classNames(
                                subItem.current
                                  ? "bg-base-200"
                                  : "hover:bg-base-200",
                                "text-base-content block rounded-md py-2 pr-2 pl-9 text-sm/6",
                              )}
                            >
                              {subItem.name}
                            </DisclosureButton>
                          </li>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
          <li></li>
          <li>
            <ThemeSwitcher />
          </li>
          <li>
            {session?.data?.user?.level !== "navigator" ? (
              <NavigatorSelector />
            ) : null}
          </li>
        </ul>
      </nav>
    </div>
  );
}
