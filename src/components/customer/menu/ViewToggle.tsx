
import React from "react";
import { Grid, List } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface ViewToggleProps {
  isGridView: boolean;
  setIsGridView: (isGrid: boolean) => void;
}

export const ViewToggle = ({ isGridView, setIsGridView }: ViewToggleProps) => {
  return (
    <Toggle
      aria-label="Toggle grid view"
      pressed={isGridView}
      onPressedChange={() => setIsGridView(!isGridView)}
    >
      {isGridView ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
    </Toggle>
  );
};
