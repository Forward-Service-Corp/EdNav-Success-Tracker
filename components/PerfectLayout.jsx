'use client';
import React, { useState } from 'react';
import { useEditing } from '/contexts/EditingContext';

export default function PerfectLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const { editing } = useEditing();

  return (
    <div>
      {children}
    </div>
  );
}