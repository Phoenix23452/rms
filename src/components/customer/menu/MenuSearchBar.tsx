
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MenuSearchBar = ({ searchQuery, setSearchQuery }: MenuSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};
