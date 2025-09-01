"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, X, Pencil, MoveUp, MoveDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const CategoryRow = ({
  category,
  onSaveEdit,
  onDelete,
  onReorder,
}: {
  category: any;
  onSaveEdit: (data: any) => void;
  onDelete: () => void;
  onReorder: (dir: "up" | "down") => void;
}) => {
  const [isEditing, setEditing] = useState(false);
  const [edit, setEdit] = useState({
    name: category.name,
    slug: category.slug,
    status: category.status,
  });

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="px-4 py-2">
        <div className="flex gap-1 items-center">
          <Button variant="ghost" size="icon" onClick={() => onReorder("up")}>
            <MoveUp className="w-4 h-4" />
          </Button>
          <span>{category.order}</span>
          <Button variant="ghost" size="icon" onClick={() => onReorder("down")}>
            <MoveDown className="w-4 h-4" />
          </Button>
        </div>
      </td>
      {isEditing ? (
        <>
          <td className="px-4 py-2">
            <Input
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
            />
          </td>
          <td className="px-4 py-2">
            <Input
              value={edit.slug}
              onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
            />
          </td>
          <td className="px-4 py-2">
            <Badge>{category._count.products}</Badge>
          </td>
          <td className="px-4 py-2">
            <Switch
              checked={edit.status}
              onCheckedChange={(checked) =>
                setEdit({ ...edit, status: checked })
              }
            />
          </td>
          <td className="px-4 py-2 text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onSaveEdit(edit);
                setEditing(false);
              }}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-2 font-medium">{category.name}</td>
          <td className="px-4 py-2">{category.slug}</td>
          <td className="px-4 py-2">
            <Badge variant="outline">{category._count.products}</Badge>
          </td>
          <td className="px-4 py-2">
            <Badge
              className={cn(
                "font-normal",
                category.status
                  ? "bg-green-300/30 text-green-600"
                  : "bg-gray-200 text-black",
              )}
            >
              {category.status ? "Active" : "In Active"}
            </Badge>
          </td>
          <td className="px-4 py-2 text-right space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </td>
        </>
      )}
    </tr>
  );
};
