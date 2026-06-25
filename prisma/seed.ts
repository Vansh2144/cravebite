import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  // ── Restaurants ──
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: "La Bella Italia",
        slug: "la-bella-italia",
        address: "42 Via Roma, Downtown",
        rating: 4.7,
        cuisine: "Italian",
        coverImage: "/images/restaurants/italian.jpg",
        deliveryTime: 35,
        isPremium: true,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Spice Garden",
        slug: "spice-garden",
        address: "18 Curry Lane, Midtown",
        rating: 4.5,
        cuisine: "Indian",
        coverImage: "/images/restaurants/indian.jpg",
        deliveryTime: 40,
        isPremium: true,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Dragon Palace",
        slug: "dragon-palace",
        address: "88 Silk Road, Chinatown",
        rating: 4.3,
        cuisine: "Chinese",
        coverImage: "/images/restaurants/chinese.jpg",
        deliveryTime: 30,
        isPremium: false,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Burger Barn",
        slug: "burger-barn",
        address: "7 Main Street, Uptown",
        rating: 4.6,
        cuisine: "Fast Food",
        coverImage: "/images/restaurants/burgers.jpg",
        deliveryTime: 20,
        isPremium: false,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Green Bowl",
        slug: "green-bowl",
        address: "55 Wellness Ave, Greenfield",
        rating: 4.8,
        cuisine: "Healthy",
        coverImage: "/images/restaurants/healthy.jpg",
        deliveryTime: 25,
        isPremium: true,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Sakura Sushi",
        slug: "sakura-sushi",
        address: "3 Cherry Blossom Rd, Eastside",
        rating: 4.9,
        cuisine: "Japanese",
        coverImage: "/images/restaurants/japanese.jpg",
        deliveryTime: 35,
        isPremium: true,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "Taco Fiesta",
        slug: "taco-fiesta",
        address: "12 Fiesta Blvd, Westside",
        rating: 4.4,
        cuisine: "Mexican",
        coverImage: "/images/restaurants/mexican.jpg",
        deliveryTime: 25,
        isPremium: false,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: "The Breakfast Club",
        slug: "the-breakfast-club",
        address: "99 Morning Lane, Central",
        rating: 4.6,
        cuisine: "Cafe",
        coverImage: "/images/restaurants/cafe.jpg",
        deliveryTime: 20,
        isPremium: false,
      },
    }),
  ]);

  console.log(`✅ Created ${restaurants.length} restaurants`);

  // ── Menu Items ──

  // La Bella Italia — Italian
  const italianItems = [
    { name: "Bruschetta al Pomodoro", description: "Toasted bread topped with fresh tomatoes, garlic, basil, and extra virgin olive oil", price: 249, category: "Starters", isVeg: true },
    { name: "Margherita Pizza", description: "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil", price: 449, category: "Mains", isVeg: true },
    { name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni, mozzarella cheese, and Italian herbs", price: 549, category: "Mains", isVeg: false },
    { name: "Spaghetti Carbonara", description: "Creamy egg-based sauce with pancetta, Pecorino Romano, and black pepper", price: 499, category: "Mains", isVeg: false },
    { name: "Penne Arrabbiata", description: "Penne pasta in spicy tomato sauce with garlic and red chili flakes", price: 399, category: "Mains", isVeg: true },
    { name: "Tiramisu", description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream", price: 299, category: "Desserts", isVeg: true },
    { name: "Panna Cotta", description: "Silky vanilla cream pudding with berry compote", price: 279, category: "Desserts", isVeg: true },
    { name: "Italian Lemonade", description: "Fresh lemon juice with sparkling water and mint", price: 149, category: "Beverages", isVeg: true },
  ];

  // Spice Garden — Indian
  const indianItems = [
    { name: "Samosa (2 pcs)", description: "Crispy pastry filled with spiced potatoes, peas, and cumin", price: 129, category: "Starters", isVeg: true },
    { name: "Chicken Tikka", description: "Tender chicken marinated in yogurt and tandoori spices, grilled to perfection", price: 349, category: "Starters", isVeg: false },
    { name: "Butter Chicken", description: "Succulent chicken in rich, creamy tomato-butter gravy with fenugreek", price: 449, category: "Mains", isVeg: false },
    { name: "Paneer Butter Masala", description: "Soft paneer cubes in luscious buttery tomato gravy", price: 399, category: "Mains", isVeg: true },
    { name: "Dal Makhani", description: "Slow-cooked black lentils in creamy butter and cream sauce", price: 299, category: "Mains", isVeg: true },
    { name: "Biryani (Chicken)", description: "Fragrant basmati rice layered with spiced chicken and saffron", price: 399, category: "Mains", isVeg: false },
    { name: "Garlic Naan", description: "Soft tandoori bread brushed with garlic butter", price: 79, category: "Breads", isVeg: true },
    { name: "Gulab Jamun (2 pcs)", description: "Golden fried milk dumplings soaked in cardamom-rose sugar syrup", price: 149, category: "Desserts", isVeg: true },
    { name: "Mango Lassi", description: "Creamy yogurt smoothie blended with Alphonso mango pulp", price: 179, category: "Beverages", isVeg: true },
  ];

  // Dragon Palace — Chinese
  const chineseItems = [
    { name: "Veg Spring Rolls (4 pcs)", description: "Crispy rolls stuffed with julienned vegetables and glass noodles", price: 199, category: "Starters", isVeg: true },
    { name: "Chicken Manchurian", description: "Crispy chicken balls in tangy, spicy Manchurian sauce", price: 349, category: "Starters", isVeg: false },
    { name: "Kung Pao Chicken", description: "Wok-tossed chicken with peanuts, dried chilies, and Sichuan pepper", price: 449, category: "Mains", isVeg: false },
    { name: "Hakka Noodles", description: "Stir-fried egg noodles with vegetables and soy sauce", price: 299, category: "Mains", isVeg: true },
    { name: "Schezwan Fried Rice", description: "Spicy fried rice with vegetables in fiery Schezwan sauce", price: 279, category: "Mains", isVeg: true },
    { name: "Honey Chilli Potato", description: "Crispy potato fingers glazed in sweet honey-chilli sauce", price: 249, category: "Starters", isVeg: true },
    { name: "Dim Sum Platter (6 pcs)", description: "Assorted steamed dumplings with dipping sauces", price: 399, category: "Starters", isVeg: false },
    { name: "Lychee Iced Tea", description: "Refreshing iced tea infused with lychee and lemon", price: 149, category: "Beverages", isVeg: true },
  ];

  // Burger Barn — Fast Food
  const burgerItems = [
    { name: "Classic Cheese Fries", description: "Golden crispy fries smothered in melted cheddar cheese", price: 179, category: "Starters", isVeg: true },
    { name: "Chicken Wings (6 pcs)", description: "Crispy buffalo wings with ranch dipping sauce", price: 299, category: "Starters", isVeg: false },
    { name: "The Classic Smash Burger", description: "Double smashed beef patty with American cheese, lettuce, tomato, and secret sauce", price: 349, category: "Mains", isVeg: false },
    { name: "BBQ Bacon Burger", description: "Smoky BBQ sauce, crispy bacon, caramelized onions, and cheddar", price: 449, category: "Mains", isVeg: false },
    { name: "Veggie Supreme Burger", description: "Crispy bean and quinoa patty with avocado, lettuce, and chipotle mayo", price: 329, category: "Mains", isVeg: true },
    { name: "Loaded Nachos", description: "Tortilla chips piled with cheese, jalapeños, salsa, and sour cream", price: 249, category: "Sides", isVeg: true },
    { name: "Chocolate Milkshake", description: "Rich and creamy Belgian chocolate milkshake topped with whipped cream", price: 199, category: "Beverages", isVeg: true },
    { name: "Oreo Blast Shake", description: "Crushed Oreo cookies blended with vanilla ice cream", price: 229, category: "Beverages", isVeg: true },
  ];

  // Green Bowl — Healthy
  const healthyItems = [
    { name: "Avocado Toast", description: "Sourdough toast with smashed avocado, cherry tomatoes, microgreens, and seeds", price: 299, category: "Starters", isVeg: true },
    { name: "Quinoa Buddha Bowl", description: "Quinoa with roasted sweet potato, chickpeas, kale, and tahini dressing", price: 449, category: "Mains", isVeg: true },
    { name: "Grilled Salmon Bowl", description: "Atlantic salmon with brown rice, edamame, seaweed, and miso glaze", price: 649, category: "Mains", isVeg: false },
    { name: "Mediterranean Wrap", description: "Whole wheat wrap with hummus, falafel, pickled vegetables, and tzatziki", price: 349, category: "Mains", isVeg: true },
    { name: "Acai Smoothie Bowl", description: "Blended acai topped with granola, fresh berries, coconut flakes, and honey", price: 399, category: "Desserts", isVeg: true },
    { name: "Detox Green Juice", description: "Cold-pressed kale, spinach, apple, ginger, and lemon juice", price: 199, category: "Beverages", isVeg: true },
    { name: "Protein Power Smoothie", description: "Banana, peanut butter, oats, and whey protein blended smooth", price: 249, category: "Beverages", isVeg: true },
  ];

  // Sakura Sushi — Japanese
  const japaneseItems = [
    { name: "Edamame", description: "Steamed young soybeans seasoned with sea salt", price: 179, category: "Starters", isVeg: true },
    { name: "Miso Soup", description: "Traditional Japanese soup with tofu, seaweed, and green onions", price: 149, category: "Starters", isVeg: true },
    { name: "California Roll (8 pcs)", description: "Inside-out roll with crab, avocado, cucumber, and sesame", price: 449, category: "Mains", isVeg: false },
    { name: "Spicy Tuna Roll (8 pcs)", description: "Fresh tuna with spicy mayo, tempura flakes, and scallions", price: 549, category: "Mains", isVeg: false },
    { name: "Vegetable Tempura", description: "Lightly battered and fried seasonal vegetables with tentsuyu dipping sauce", price: 349, category: "Mains", isVeg: true },
    { name: "Chicken Teriyaki Don", description: "Glazed teriyaki chicken over steamed rice with pickled ginger", price: 449, category: "Mains", isVeg: false },
    { name: "Matcha Ice Cream", description: "Premium Japanese green tea ice cream with mochi", price: 249, category: "Desserts", isVeg: true },
    { name: "Sake (Glass)", description: "Chilled premium Junmai sake", price: 399, category: "Beverages", isVeg: true },
    { name: "Japanese Iced Matcha", description: "Ceremonial grade matcha latte over ice with oat milk", price: 229, category: "Beverages", isVeg: true },
  ];

  // Taco Fiesta — Mexican
  const mexicanItems = [
    { name: "Guacamole & Chips", description: "Fresh avocado guacamole with warm tortilla chips and pico de gallo", price: 229, category: "Starters", isVeg: true },
    { name: "Chicken Quesadilla", description: "Grilled flour tortilla stuffed with chicken, cheese, peppers, and onions", price: 329, category: "Starters", isVeg: false },
    { name: "Carne Asada Tacos (3 pcs)", description: "Marinated grilled steak with onion, cilantro, and lime on corn tortillas", price: 449, category: "Mains", isVeg: false },
    { name: "Fish Tacos (3 pcs)", description: "Beer-battered fish with cabbage slaw, chipotle crema, and lime", price: 399, category: "Mains", isVeg: false },
    { name: "Bean & Cheese Burrito", description: "Large flour tortilla filled with refried beans, rice, cheese, and salsa", price: 299, category: "Mains", isVeg: true },
    { name: "Churros (4 pcs)", description: "Crispy cinnamon sugar churros with chocolate dipping sauce", price: 199, category: "Desserts", isVeg: true },
    { name: "Horchata", description: "Traditional Mexican rice milk drink with cinnamon and vanilla", price: 149, category: "Beverages", isVeg: true },
  ];

  // The Breakfast Club — Cafe
  const cafeItems = [
    { name: "Classic Eggs Benedict", description: "Poached eggs on English muffin with Canadian bacon and hollandaise", price: 399, category: "Mains", isVeg: false },
    { name: "Fluffy Pancake Stack", description: "Three buttermilk pancakes with maple syrup, berries, and whipped cream", price: 349, category: "Mains", isVeg: true },
    { name: "Avocado & Eggs Skillet", description: "Baked eggs with avocado, feta cheese, cherry tomatoes, and sourdough", price: 379, category: "Mains", isVeg: true },
    { name: "BLT Club Sandwich", description: "Triple-decker with bacon, lettuce, tomato, and garlic aioli on toasted bread", price: 329, category: "Mains", isVeg: false },
    { name: "French Toast", description: "Brioche French toast with caramelized bananas and cinnamon", price: 299, category: "Mains", isVeg: true },
    { name: "Fresh Fruit Bowl", description: "Seasonal fresh fruits with honey yogurt and granola", price: 249, category: "Starters", isVeg: true },
    { name: "Flat White", description: "Double shot espresso with velvety steamed milk", price: 179, category: "Beverages", isVeg: true },
    { name: "Cold Brew Coffee", description: "Slow-steeped cold brew served over ice with a hint of vanilla", price: 199, category: "Beverages", isVeg: true },
    { name: "Berry Blast Smoothie", description: "Strawberries, blueberries, banana, and Greek yogurt blended smooth", price: 229, category: "Beverages", isVeg: true },
  ];

  // Create all menu items
  const allMenuData = [
    { restaurant: restaurants[0], items: italianItems },
    { restaurant: restaurants[1], items: indianItems },
    { restaurant: restaurants[2], items: chineseItems },
    { restaurant: restaurants[3], items: burgerItems },
    { restaurant: restaurants[4], items: healthyItems },
    { restaurant: restaurants[5], items: japaneseItems },
    { restaurant: restaurants[6], items: mexicanItems },
    { restaurant: restaurants[7], items: cafeItems },
  ];

  let totalItems = 0;
  for (const { restaurant, items } of allMenuData) {
    await prisma.menuItem.createMany({
      data: items.map((item) => ({
        restaurantId: restaurant.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        isVeg: item.isVeg,
        available: true,
      })),
    });
    totalItems += items.length;
  }

  console.log(`✅ Created ${totalItems} menu items`);
  console.log("🎉 Database seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
