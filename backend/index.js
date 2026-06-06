const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const RESTAURANTS = [
  {
    id: 1, name: "Mama's Kitchen", cuisine: "Nigerian", rating: 4.8,
    deliveryTime: "20-30 min", deliveryFee: 500, image: "🍲", tag: "Popular", tagColor: "#C8FF00",
    menu: [
      { id: 101, name: "Jollof Rice + Chicken",  price: 3500, desc: "Smoky party jollof with grilled chicken", emoji: "🍛" },
      { id: 102, name: "Egusi Soup + Eba",        price: 3000, desc: "Rich egusi with stockfish and ponmo",    emoji: "🥘" },
      { id: 103, name: "Pounded Yam + Ofe Akwu",  price: 3200, desc: "Smooth pounded yam with palm nut soup", emoji: "🫕" },
      { id: 104, name: "Fried Rice + Turkey",     price: 4000, desc: "Nigerian fried rice with turkey",       emoji: "🍚" },
    ],
  },
  {
    id: 2, name: "Grillz & More", cuisine: "BBQ · Grills", rating: 4.6,
    deliveryTime: "25-35 min", deliveryFee: 600, image: "🔥", tag: "Top Rated", tagColor: "#FF6B35",
    menu: [
      { id: 201, name: "Suya Platter",     price: 4500, desc: "Spiced beef suya with onions & tomatoes", emoji: "🍢" },
      { id: 202, name: "Grilled Catfish",  price: 6000, desc: "Whole catfish with pepper sauce & chips",  emoji: "🐟" },
      { id: 203, name: "Asun (Goat Meat)", price: 5000, desc: "Peppered goat meat, smoky and spicy",     emoji: "🥩" },
      { id: 204, name: "Chicken Wings x6", price: 3800, desc: "Smoky BBQ wings with house dip",          emoji: "🍗" },
    ],
  },
  {
    id: 3, name: "Wrap & Roll", cuisine: "Shawarma · Wraps", rating: 4.5,
    deliveryTime: "15-25 min", deliveryFee: 400, image: "🌯", tag: "Fast", tagColor: "#00C8FF",
    menu: [
      { id: 301, name: "Chicken Shawarma", price: 2500, desc: "Loaded chicken wrap with garlic sauce", emoji: "🌯" },
      { id: 302, name: "Beef Shawarma",    price: 2800, desc: "Spiced beef with coleslaw & chips",     emoji: "🌮" },
      { id: 303, name: "Club Sandwich",    price: 2200, desc: "Triple decker with chicken & egg",      emoji: "🥪" },
      { id: 304, name: "Loaded Fries",     price: 1800, desc: "Crispy fries with cheese & jalapeños",  emoji: "🍟" },
    ],
  },
  {
    id: 4, name: "Sweet Tooth", cuisine: "Desserts · Drinks", rating: 4.7,
    deliveryTime: "20-30 min", deliveryFee: 350, image: "🍰", tag: "New", tagColor: "#FF6B6B",
    menu: [
      { id: 401, name: "Chocolate Lava Cake", price: 2500, desc: "Warm molten chocolate cake + ice cream", emoji: "🍫" },
      { id: 402, name: "Chapman Drink",       price: 1200, desc: "Classic Nigerian Chapman cocktail",      emoji: "🍹" },
      { id: 403, name: "Chin Chin Parfait",   price: 2000, desc: "Layered dessert with local chin chin",   emoji: "🍨" },
      { id: 404, name: "Fresh Zobo",          price: 800,  desc: "Chilled hibiscus drink, lightly spiced", emoji: "🫖" },
    ],
  },
];

let orders = [];
let nextOrderId = 1000;

app.get("/api/restaurants", (req, res) => {
  res.json(RESTAURANTS);
});

app.get("/api/restaurants/:id", (req, res) => {
  const restaurant = RESTAURANTS.find(r => r.id === Number(req.params.id));
  if (!restaurant) return res.status(404).json({ error: "Not found" });
  res.json(restaurant);
});

app.post("/api/orders", (req, res) => {
  const { customerName, restaurantId, items, total } = req.body;
  if (!restaurantId || !items?.length) {
    return res.status(400).json({ error: "restaurantId and items are required" });
  }
  const order = {
    id: `TKT-${nextOrderId++}`,
    customerName: customerName || "Guest",
    restaurantId,
    items,
    total,
    status: "received",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.patch("/api/orders/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  const { status, rider } = req.body;
  if (status) order.status = status;
  if (rider !== undefined) order.rider = rider;
  res.json(order);
});

app.delete("/api/orders/:id", (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  orders.splice(idx, 1);
  res.json({ ok: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`TekTa-Eats API running on http://localhost:${PORT}`));
