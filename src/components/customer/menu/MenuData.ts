
// Static menu data
export const MenuData = {
  menuItems: [
    {
      id: 1,
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with cheese",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "burgers",
      isSpecial: false,
      dietary: ["Gluten-Free", "Vegetarian"]
    },
    {
      id: 2,
      name: "Margherita Pizza",
      description: "Classic Italian pizza",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "pizza",
      isSpecial: true,
      dietary: ["Vegetarian"]
    },
    {
      id: 3,
      name: "Veggie Burger",
      description: "Plant-based patty",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "burgers",
      isSpecial: false,
      dietary: ["Vegan", "Vegetarian"]
    },
    {
      id: 4,
      name: "French Fries",
      description: "Crispy golden fries",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "sides",
      isSpecial: false,
      dietary: []
    },
    {
      id: 5,
      name: "Chocolate Brownie Sundae",
      description: "Warm chocolate brownie",
      price: 6.99,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "desserts",
      isSpecial: false,
      dietary: ["Vegetarian"]
    },
    {
      id: 6,
      name: "Iced Coffee",
      description: "Chilled coffee",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1499961576254-7a8506200076?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "beverages",
      isSpecial: false,
      dietary: ["Vegan", "Vegetarian"]
    },
    {
      id: 7,
      name: "Spicy Chicken Pizza",
      description: "Spicy tomato sauce",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "pizza",
      isSpecial: true,
      dietary: []
    },
    {
      id: 8,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "sides",
      isSpecial: false,
      dietary: ["Vegetarian"]
    },
  ],
  categories: [
    { id: "all", name: "All Items" },
    { id: "burgers", name: "Burgers" },
    { id: "pizza", name: "Pizza" },
    { id: "sides", name: "Sides" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
  ]
};

export default MenuData;
