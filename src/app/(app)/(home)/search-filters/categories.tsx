import { CustomCategory } from "../types";
import CategoryDropdown from "./category-dropdown";

interface Props {
  data: CustomCategory[];
}
const Categories = ({ data }: Props) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-wrap gap-2 items-center">
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
