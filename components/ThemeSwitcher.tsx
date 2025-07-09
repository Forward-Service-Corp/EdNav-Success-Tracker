'use client';

import React, { useEffect, useState } from 'react';
import { useThemes } from '@/contexts/ThemesContext';

const themes = [
  'corporate',
  'fantasy',
  'light',
  'nord',
  'abyss',
  'business',
  // 'dracula',
  // 'halloween',
  'night',
  'sunset',
  'synthwave'
];
// List of available DaisyUI themes
// const themes = [
//   'Light Themes',
//   'acid',
//   'autumn',
//   'bumblebee',
//   'caramellatte',
//   'cmyk',
//   'corporate',
//   'cupcake',
//   'cyberpunk',
//   'emerald',
//   'fantasy',
//   'garden',
//   'lemonade',
//   'light',
//   'lofi',
//   'nord',
//   'pastel',
//   'retro',
//   'silk',
//   'valentine',
//   'winter',
//   'wireframe',
//   'Dark Themes',
//   'abyss',
//   'aqua',
//   'black',
//   'business',
//   'coffee',
//   'dark',
//   'dim',
//   'dracula',
//   'forest',
//   'halloween',
//   'luxury',
//   'night',
//   'sunset',
//   'synthwave'
// ];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme && themes.includes(savedTheme) ? themes.indexOf(savedTheme) : 0;
    }
    return 0;
  });

  const { setSelectedTheme } = useThemes() as unknown as {
    selectedTheme: string;
    setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
  };

  // Update the theme only when it changes
  useEffect(() => {
    const selected = themes[theme];
    document.documentElement.setAttribute('data-theme', selected);
    localStorage.setItem('theme', selected);
    setSelectedTheme(selected);
  }, [theme, setSelectedTheme]);

  return (
    <div className="w-[180px]" style={{ zIndex: 10 }}>
      <label htmlFor="theme-select" className="text-sm">Theme:
      <select
        name="theme-select"
        id="theme-select"
        value={theme}
        className="select capitalize mt-1"
        onChange={(e) => setTheme(Number(e.target.value))}
      >
        {themes.map((theme, index) => (
          <option className={`capitalize`} disabled={theme === "Light Themes" || theme === "Dark Themes"} key={theme} value={index}>
            {theme}
          </option>
        ))}
      </select>
      </label>
    </div>
  );
}