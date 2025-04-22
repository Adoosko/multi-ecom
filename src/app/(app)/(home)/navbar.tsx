"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { NavbarSidebar } from "./navbar-sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}
const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Link href={href}>
      <Button
        variant={"outline"}
        className={cn(
          "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
          isActive && " bg-black text-white hover:bg-black hover:text-white"
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

const navbarItems = [
  { href: "/", children: "Domov" },
  { href: "/about", children: "O nas" },
  { href: "/services", children: "Sluzby" },
  { href: "/pricing", children: "Cennik" },
  { href: "/contact", children: "Kontakt" },
];
const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  return (
    <nav className="h-20 flex border-b justify-between fot-medium bg-white">
      <Link href={"/"} className="pl-6 items-center flex">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          funroad
        </span>
      </Link>
      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <div className="items-center gap-4 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      <div className="hidden lg:flex">
        <Link href={"/sign-in"}>
          <Button
            variant={"secondary"}
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white
          hover:bg-pink-400 transition-colors text-lg"
          >
            Prihlasit sa
          </Button>
        </Link>
        <Link href={"/sign-up"}>
          <Button
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white
         hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            Zacni predavat
          </Button>
        </Link>
      </div>
      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
