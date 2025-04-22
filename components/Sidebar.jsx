import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Logo from "./Logo";
import NavigatorSelector from "./NavigatorSelector";
import ThemeSwitcher from "./ThemeSwitcher";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  {
    name: "Client Status",
    icon: UsersIcon,
    current: false,
    children: [
      { name: "All", href: "#" },
      { name: "Active", href: "#" },
      { name: "In Progress", href: "#" },
      { name: "Graduated", href: "#" },
      { name: "Inactive", href: "#" },
    ],
  },
  {
    name: "Age",
    icon: FolderIcon,
    current: false,
    children: [
      { name: "All", href: "#" },
      { name: "Adult", href: "#" },
      { name: "Youth", href: "#" },
    ],
  },
  {
    name: "Themes",
    icon: CalendarIcon,
    current: false,
    children: [
      { name: "Light", href: "#" },
      { name: "Fantasy", href: "#" },
      { name: "Corporate", href: "#" },
      { name: "Nord", href: "#" },
      { name: "Business", href: "#" },
      { name: "Sunset", href: "#" },
      { name: "Synthwave", href: "#" },
      { name: "Night", href: "#" },
      { name: "Abyss", href: "#" },
    ],
  },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ toggleSidebar }) {
  const { data: session } = useSession();
  return (
    <div className="bg-base-200 z-20 flex h-screen flex-col gap-y-5 overflow-y-auto px-6 shadow-lg">
      <div className="flex h-[80px] shrink-0 items-center">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <a
                      href={item.href}
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
          <li>
            <button onClick={toggleSidebar}>djdhd</button>
          </li>
          <li>
            <ThemeSwitcher />
          </li>
          <li>
            {session?.data?.user?.level !== "navigator" ? (
              <NavigatorSelector />
            ) : null}
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="text-base-content hover:bg-base-200 flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold"
            >
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="bg-base-200 size-8 rounded-full"
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
