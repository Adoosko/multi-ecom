import { Category } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { ReactNode } from "react";
import Footer from "./footer";

import SearchFilters from "./search-filters";
import { CustomCategory } from "./types";
import Navbar from "@/components/Nav/Navbar";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // beacuase of depth of 1 we are confident that doc will be a type of Category
      ...(doc as Category),
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      {/* <SearchFilters data={formattedData} /> */}
      <div className="flex-1 bg-background">{children}</div>
      
      <Footer />
    </div>
  );
};

export default HomeLayout;
