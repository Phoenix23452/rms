"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  MoreVertical,
  Save,
  X,
  MoveUp,
  MoveDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CategoryRow = ({
  category,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: any) => {
  const [editData, setEditData] = useState({
    name: category.name,
    slug: category.slug,
    status: category.status === "Active",
  });

  const handleSave = () => {
    onSaveEdit(category.id, {
      name: editData.name,
      slug: editData.slug,
      status: editData.status ? "Active" : "Inactive",
    });
  };

  if (isEditing) {
    return (
      <tr className="border-b border-border hover:bg-muted/50">
        <td className="py-3 px-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <MoveUp className="h-4 w-4" />
            </Button>
            <span>{category.order}</span>
            <Button variant="ghost" size="icon">
              <MoveDown className="h-4 w-4" />
            </Button>
          </div>
        </td>
        <td className="py-3 px-4">
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </td>
        <td className="py-3 px-4">
          <Input
            value={editData.slug}
            onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
          />
        </td>
        <td className="py-3 px-4">
          <Badge>{category.productsCount}</Badge>
        </td>
        <td className="py-3 px-4">
          <Switch
            checked={editData.status}
            onCheckedChange={(checked) =>
              setEditData({ ...editData, status: checked })
            }
          />
        </td>
        <td className="py-3 px-4 text-right">
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border hover:bg-muted/50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <MoveUp className="h-4 w-4" />
          </Button>
          <span>{category.order}</span>
          <Button variant="ghost" size="icon">
            <MoveDown className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <td className="py-3 px-4 font-medium">{category.name}</td>
      <td className="py-3 px-4 text-muted-foreground">{category.slug}</td>
      <td className="py-3 px-4">
        <Badge>{category.productsCount}</Badge>
      </td>
      <td className="py-3 px-4">
        <Badge
          className={
            category.status
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {category.status ? "Active" : "In Active"}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right">
        <Button variant="ghost" size="icon" onClick={onStartEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
