import { ReactNode } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
