
import React from "react";

interface ProductImageProps {
  image: string;
  name: string;
}

export const ProductImage = ({ image, name }: ProductImageProps) => {
  return (
    <div className="mb-4 rounded-md overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
    </div>
  );
};
