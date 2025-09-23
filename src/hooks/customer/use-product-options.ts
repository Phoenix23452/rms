import { useState, useEffect } from "react";

export const useProductOptions = (selectedItem: any) => {
  const [optionalItems, setOptionalItems] = useState([]);

  // Fetch product variations and optional items when an item is selected
  useEffect(() => {
    if (selectedItem) {
      // In a real implementation, we would fetch variations and optional items from database

      // Different variations based on product type/category

      const optionals = [
        {
          id: 1,
          name: "Raita",
          price: 1.99,
          variations: [
            { id: 11, name: "Small", price: 1.99 },
            { id: 12, name: "Large", price: 2.99 },
          ],
        },
        {
          id: 2,
          name: "Salad",
          price: 2.99,
          variations: [
            { id: 21, name: "Small", price: 2.99 },
            { id: 22, name: "Large", price: 4.99 },
          ],
        },
        {
          id: 3,
          name: "Soft Drink",
          price: 1.99,
          variations: [
            { id: 31, name: "330ml Can", price: 1.99 },
            { id: 32, name: "1L Bottle", price: 3.49 },
            { id: 33, name: "1.5L Bottle", price: 4.99 },
          ],
        },
      ];
      setOptionalItems(optionals);
    }
  }, [selectedItem]);

  return {
    optionalItems,
  };
};

export default useProductOptions;
