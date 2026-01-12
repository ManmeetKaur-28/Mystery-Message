"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="h-20 flex  items-center justify-between p-10 border-b border-gray-400">
      <span className="text-2xl font-semibold">MYSTERY MESSAGE</span>
      {user ? (
        <Button onClick={() => signOut()}>Logout</Button>
      ) : (
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
