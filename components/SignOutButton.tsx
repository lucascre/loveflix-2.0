"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      Sair
    </button>
  );
}