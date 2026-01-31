import type { UIProduct } from "@/types/Product";

export const products: Array<UIProduct> = [
  {
    productId: "1",
    productName: "Fresh Organic Tomato",
    description:
      "Fresh organic tomatoes grown in local farms, ideal for cooking and salads. Rich in vitamins and antioxidants.",
    productImage:
      "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/3612a66c-23b9-5573-ba65-d76285003deb/8f037b8a-487e-5bc4-8aef-95264a468c03.jpg",
    productImages: [
      "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/3612a66c-23b9-5573-ba65-d76285003deb/8f037b8a-487e-5bc4-8aef-95264a468c03.jpg",
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&q=80",
      "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&q=80",
    ],
    price: "120",
    productPrice: 120,
    originalPrice: 150,
    quantity: "100",
    rating: 4.5,
    category: "Vegetables",
    inStock: true,
    createdAt: "2025-03-10",
    expectedLifeSpan: "7",
    label: "Best Seller",
  },
  {
    productId: "2",
    productName: "Premium Farm Potato",
    description:
      "Locally harvested potatoes with excellent taste and quality, perfect for daily meals. Versatile cooking ingredient.",
    productImage:
      "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/9737dd79-e949-5fc2-be36-c52eff17d81d/e91e73d4-022b-59db-9713-717a2a198855.jpg",
    productImages: [
      "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/9737dd79-e949-5fc2-be36-c52eff17d81d/e91e73d4-022b-59db-9713-717a2a198855.jpg",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
    ],
    price: "80",
    productPrice: 80,
    quantity: "200",
    rating: 4.7,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-03-12",
    expectedLifeSpan: "30",
    label: "Super Saver",
  },
  {
    productId: "3",
    productName: "Fresh Green Cabbage",
    description:
      "Crisp and fresh green cabbage grown using sustainable farming methods. Packed with nutrients and fiber.",
    productImage:
      "https://i0.wp.com/live.staticflickr.com/65535/54473906289_30bdfbe1a2_z.jpg?resize=640%2C427&ssl=1",
    productImages: [
      "https://i0.wp.com/live.staticflickr.com/65535/54473906289_30bdfbe1a2_z.jpg?resize=640%2C427&ssl=1",
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80",
    ],
    price: "60",
    productPrice: 60,
    originalPrice: 75,
    quantity: "75",
    rating: 4.3,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-03-15",
    expectedLifeSpan: "10",
  },
  {
    productId: "4",
    productName: "Organic Cauliflower",
    description:
      "Farm-fresh cauliflower with rich texture and nutrients, perfect for soups and curries. Low in calories, high in vitamins.",
    productImage:
      "https://media.istockphoto.com/id/534039738/photo/broccoli-cauliflower-and-cabbage.jpg?s=612x612&w=0&k=20&c=5DpItohJHivcoyIHbdMiBDR3wr2hIUazHE0rurHFO9c=",
    productImages: [
      "https://media.istockphoto.com/id/534039738/photo/broccoli-cauliflower-and-cabbage.jpg?s=612x612&w=0&k=20&c=5DpItohJHivcoyIHbdMiBDR3wr2hIUazHE0rurHFO9c=",
      "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&q=80",
    ],
    price: "90",
    productPrice: 90,
    quantity: "90",
    rating: 4.6,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-03-18",
    expectedLifeSpan: "10",
    label: "New Arrival",
  },
  {
    productId: "5",
    productName: "Mansuli Rice (Premium)",
    description:
      "High-quality Mansuli rice, known for its soft texture and delicious aroma. Perfect for daily meals and special occasions.",
    productImage:
      "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=",
    productImages: [
      "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
    ],
    price: "1800",
    productPrice: 1800,
    originalPrice: 2000,
    quantity: "25",
    rating: 4.9,
    category: "Grains",
    inStock: true,
    createdAt: "2023-03-20",
    expectedLifeSpan: "365",
    label: "Hot Deal",
  },
  {
    productId: "6",
    productName: "Fresh Carrot",
    description:
      "Crunchy and sweet carrots, rich in beta-carotene and vitamins. Great for salads, juices, and cooking.",
    productImage:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    productImages: [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
      "https://images.unsplash.com/photo-1582515073490-39981397c445?w=800&q=80",
    ],
    price: "100",
    productPrice: 100,
    quantity: "150",
    rating: 4.4,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-03-22",
    expectedLifeSpan: "14",
  },
  {
    productId: "7",
    productName: "Organic Spinach",
    description:
      "Fresh leafy spinach packed with iron and nutrients. Perfect for healthy salads and traditional dishes.",
    productImage:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
    productImages: [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
    ],
    price: "70",
    productPrice: 70,
    originalPrice: 85,
    quantity: "120",
    rating: 4.8,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-03-25",
    expectedLifeSpan: "5",
    label: "Super Saver",
  },
  {
    productId: "8",
    productName: "Red Onion",
    description:
      "Fresh red onions with strong flavor, essential for cooking. Adds depth to curries and salads.",
    productImage:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80",
    productImages: [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80",
      "https://images.unsplash.com/photo-1587486937149-5efe4e87e4e3?w=800&q=80",
    ],
    price: "95",
    productPrice: 95,
    quantity: "180",
    rating: 4.2,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-03-28",
    expectedLifeSpan: "20",
  },
  {
    productId: "9",
    productName: "Fresh Cucumber",
    description:
      "Crisp and refreshing cucumbers, perfect for salads and raita. Hydrating and low in calories.",
    productImage:
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80",
    productImages: [
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80",
      "https://images.unsplash.com/photo-1589927986089-35812388d1f6?w=800&q=80",
    ],
    price: "50",
    productPrice: 50,
    quantity: "200",
    rating: 4.1,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-04-01",
    expectedLifeSpan: "7",
    label: "Limited",
  },
  {
    productId: "10",
    productName: "Bell Pepper Mix",
    description:
      "Colorful mix of bell peppers - red, yellow, and green. Rich in vitamins and adds color to your dishes.",
    productImage:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80",
    productImages: [
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
      "https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=800&q=80",
    ],
    price: "150",
    productPrice: 150,
    originalPrice: 180,
    quantity: "60",
    rating: 4.7,
    category: "Vegetables",
    inStock: true,
    createdAt: "2023-04-05",
    expectedLifeSpan: "12",
    label: "Best Seller",
  },
];