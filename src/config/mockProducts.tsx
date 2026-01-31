import type { UIProduct } from "@/types/Product";

export const products: Array<UIProduct> = [
  {
    productId: "1",
    productName: "Tomato",
    description:
      "Fresh organic tomatoes grown in local farms, ideal for cooking and salads.",
    productImage:
      "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/3612a66c-23b9-5573-ba65-d76285003deb/8f037b8a-487e-5bc4-8aef-95264a468c03.jpg",
    price: "120",
    quantity: "100",
    createdAt: "2025-03-10",
    expectedLifeSpan: "7",
  },
  {
    productId: "2",
    productName: "Potato",
    description:
      "Locally harvested potatoes with excellent taste and quality, perfect for daily meals.",
    productImage:
      "https://d2u1z1lopyfwlx.cloudfront.net/thumbnails/9737dd79-e949-5fc2-be36-c52eff17d81d/e91e73d4-022b-59db-9713-717a2a198855.jpg",
    price: "80",
    quantity: "200",
    createdAt: "2023-03-12",
    expectedLifeSpan: "30",
  },
  {
    productId: "3",
    productName: "Cabbage",
    description:
      "Crisp and fresh green cabbage grown using sustainable farming methods.",
    productImage:
      "https://i0.wp.com/live.staticflickr.com/65535/54473906289_30bdfbe1a2_z.jpg?resize=640%2C427&ssl=1",
    price: "60",
    quantity: "75",
    createdAt: "2023-03-15",
    expectedLifeSpan: "10",
  },
  {
    productId: "4",
    productName: "Cauliflower",
    description:
      "Farm-fresh cauliflower with rich texture and nutrients, perfect for soups and curries.",
    productImage:
      "https://media.istockphoto.com/id/534039738/photo/broccoli-cauliflower-and-cabbage.jpg?s=612x612&w=0&k=20&c=5DpItohJHivcoyIHbdMiBDR3wr2hIUazHE0rurHFO9c=",
    price: "90",
    quantity: "90",
    createdAt: "2023-03-18",
    expectedLifeSpan: "10",
  },
  {
    productId: "5",
    productName: "Rice (Mansuli)",
    description:
      "High-quality Mansuli rice, known for its soft texture and delicious aroma.",
    productImage:
      "https://media.istockphoto.com/id/153737841/photo/rice.jpg?s=612x612&w=0&k=20&c=lfO7iLT0UsDDzra0uBOsN1rvr2d5OEtrG2uwbts33_c=",
    price: "1800",
    quantity: "25",
    createdAt: "2023-03-20",
    expectedLifeSpan: "365",
  },
];