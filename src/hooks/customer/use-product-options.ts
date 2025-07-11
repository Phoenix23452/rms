
import { useState, useEffect } from 'react';

export const useProductOptions = (selectedItem: any) => {
  const [productVariations, setProductVariations] = useState([]);
  const [optionalItems, setOptionalItems] = useState([]);

  // Fetch product variations and optional items when an item is selected
  useEffect(() => {
    if (selectedItem) {
      // In a real implementation, we would fetch variations and optional items from database
      
      // Different variations based on product type/category
      let variations = [];
      
      if (selectedItem.category === "pizza") {
        // Pizza sizes
        variations = [
          { id: 1, name: 'Small', price: selectedItem.price },
          { id: 2, name: 'Medium', price: selectedItem.price * 1.5 },
          { id: 3, name: 'Large', price: selectedItem.price * 2 },
        ];
      } else if (selectedItem.category === "burgers") {
        // Burger has only regular size
        variations = [
          { id: 1, name: 'Regular', price: selectedItem.price },
        ];
      } else if (selectedItem.category === "desserts" || selectedItem.category === "beverages") {
        // Desserts and beverages typically have portion sizes
        variations = [
          { id: 1, name: 'Regular', price: selectedItem.price },
          { id: 2, name: 'Large', price: selectedItem.price * 1.4 },
        ];
      } else if (selectedItem.category === "traditional") {
        // Traditional food might have full/half/quarter options
        variations = [
          { id: 1, name: 'Full', price: selectedItem.price },
          { id: 2, name: 'Half', price: selectedItem.price / 2 },
          { id: 3, name: 'Quarter', price: selectedItem.price / 4 },
        ];
      } else {
        // Default for other categories
        variations = [
          { id: 1, name: 'Regular', price: selectedItem.price },
        ];
      }
      
      const optionals = [
        { id: 1, name: 'Raita', price: 1.99, variations: [
          { id: 11, name: 'Small', price: 1.99 },
          { id: 12, name: 'Large', price: 2.99 }
        ]},
        { id: 2, name: 'Salad', price: 2.99, variations: [
          { id: 21, name: 'Small', price: 2.99 },
          { id: 22, name: 'Large', price: 4.99 }
        ]},
        { id: 3, name: 'Soft Drink', price: 1.99, variations: [
          { id: 31, name: '330ml Can', price: 1.99 },
          { id: 32, name: '1L Bottle', price: 3.49 },
          { id: 33, name: '1.5L Bottle', price: 4.99 }
        ]}
      ];
      
      setProductVariations(variations);
      setOptionalItems(optionals);
    }
  }, [selectedItem]);

  return {
    productVariations,
    optionalItems
  };
};

export default useProductOptions;
