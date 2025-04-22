import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import { Fire, Question, SmileySad, ThumbsUp, User } from "phosphor-react";

const icons = {
  Fire,
  Question,
  SmileySad,
  ThumbsUp,
  User,
};

export default function MoodSelect({ mood, setNote }) {
  const getIconBGColor = (status) => {
    switch (status) {
      case "ThumbsUp":
        return "bg-success text-success-content";
      case "SmileySad":
        return "bg-info text-accent-content";
      case "Fire":
        return "bg-error text-error-content";
      case "Question":
        return "bg-info text-info-content";
      default:
        return "bg-success text-success-content";
    }
  };

  const getIconColor = (status) => {
    switch (status) {
      case "ThumbsUp":
        return <ThumbsUp size={26} className="text-success-content" />;
      case "SmileySad":
        return <SmileySad size={26} className="text-accent-content" />;
      case "Fire":
        return <Fire size={26} className="text-error-content" />;
      case "Question":
        return <Question size={26} className="text-info-content" />;
      default:
        return <User size={23} className="text-success-content" />;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          className={`block h-[43px] w-[43px] justify-center rounded-full ${getIconBGColor(mood)} text-base-content py-2 pr-4 pl-3 text-center font-semibold shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50`}
        >
          {/*<ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />*/}
          <div className={`mr-2`}>{getIconColor(mood)}</div>
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 mt-2 w-12 origin-top-right divide-y divide-gray-100 rounded-full bg-white px-2 shadow ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
      >
        {Object.keys(icons).map((icon) => (
          <div key={icon.toString()} className="py-1">
            <MenuItem className="group">
              {
                <div
                  onClick={() => {
                    setNote((prevState) => {
                      return {
                        ...prevState,
                        mood: icon.toString(),
                      };
                    });
                  }}
                  className={`flex items-center justify-center p-1 ${getIconBGColor(icon.toString())} cursor-pointer rounded-full hover:bg-gray-100`}
                >
                  {getIconColor(icon)}
                </div>
              }
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
}
