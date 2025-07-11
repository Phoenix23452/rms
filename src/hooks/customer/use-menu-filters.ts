
import { useState, useMemo } from "react";
import { MenuData } from "@/components/customer/menu/MenuData";

export const useMenuFilters = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(true);

  const filteredItems = useMemo(() => {
    return MenuData.menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isGridView,
    setIsGridView,
    filteredItems
  };
};

export default useMenuFilters;
