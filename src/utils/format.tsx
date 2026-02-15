export const format = {
  currency: (n: number) => `Rs. ${n.toFixed(2)}`,
  date: (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  time: (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
};