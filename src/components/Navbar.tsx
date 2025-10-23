"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Optional: fetch user info from server API if needed
  }, []);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Quran Explorer</h1>
      {user ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm">{user}</span>
        </div>
      ) : (
        <span className="text-sm">Guest</span>
      )}
    </nav>
  );
}
