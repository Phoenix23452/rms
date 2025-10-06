import { useState, useMemo } from "react";
import { MenuData } from "@/components/customer/menu/MenuData";

export const useMenuFilters = () => {
  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
};

export default useMenuFilters;
