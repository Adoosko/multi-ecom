"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { CustomCategory } from "../types";
import SubcategoryMenu from "./subcategory-menu";
import { useDropdownPosition } from "./use-dropdown-position";
interface Props {
  category: CustomCategory;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };
  const onMouseLeave = () => {
    setIsOpen(false);
  };
  const dropdownPosition = getDropdownPosition();
  return (
    <div
      className="relative "
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          className={cn(
            "h-11 px-4 hover:bg-transparent border-transparent rounded-full  hover:border-primary text-black bg-gray-100 text-gray-700",
            isActive && isNavigationHovered && "bg-white border-primary"
          )}
          variant={"elevated"}
        >
          {category.name}
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0", // Základné štýly a pozícia
              "border-l-[10px] border-l-transparent", // << PRIDANÉ border-l-transparent
              "border-r-[10px] border-r-transparent", // Pravý okraj priehľadný
              "border-b-[10px] border-b-black", // Spodný okraj čierny (vytvára šípku hore)
              "left-1/2 -translate-x-1/2", // Centrovanie
              isOpen && "opacity-100" // Podmienená viditeľnosť
            )}
          ></div>
        )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};

export default CategoryDropdown;
