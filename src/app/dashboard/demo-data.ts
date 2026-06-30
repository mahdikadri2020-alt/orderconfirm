import type { Order } from "@/types";

const wilayas = [
  "Alger", "Oran", "Constantine", "Sétif", "Blida", "Tizi Ouzou", "Béjaïa",
  "Annaba", "Tlemcen", "Batna", "Sidi Bel Abbès", "Biskra", "Tébessa",
  "Chlef", "Bordj Bou Arréridj", "Béchar", "Médéa", "Mostaganem", "M'Sila",
  "Skikda", "Ouargla", "Djelfa", "Tiaret", "Bouira", "El Oued",
];

const products = [
  "T-shirt Premium", "Jean Slim Fit", "Robe d'été", "Lot de 3 t-shirts",
  "Sneakers Air Max", "Montre connectée", "Sac à dos urbain",
  "Parfum Orientale", "Crème hydratante", "Smartphone Galaxy A15",
  "Casque Bluetooth", "Lunettes de soleil", "Ceinture cuir",
  "Ensemble jogging", "Costume cravate", "Baskets casual",
  "Veste bomber", "Chemise lin", "Pantalon chino", "Pull col roulé",
  "Écouteurs sans fil", "Chargeur rapide", "Coque téléphone",
  "Sac main femme", "Portefeuille homme", "Montre sport",
  "Collier argent", "Boucles d'oreilles", "Bijoux ensemble", "Parfum homme",
];

const customerFirstNames = [
  "Mohamed", "Ahmed", "Ali", "Karim", "Rachid", "Sarah", "Fatima", "Nadia",
  "Samir", "Yasmine", "Omar", "Amina", "Hassan", "Laila", "Sofiane", "Ines",
  "Amine", "Malika", "Kamel", "Zineb", "Mehdi", "Mouna", "Farid", "Salima",
];

const customerLastNames = [
  "Benali", "Bouaziz", "Chennouf", "Djebali", "Haddad", "Sahnoun", "Guerfi",
  "Khelifi", "Mansouri", "Nouri", "Ouali", "Rahmani", "Slimani", "Toumi",
  "Zeroual", "Bekhti", "Chaoui", "Dahmani", "Ferhat", "Gacem",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysBack));
  d.setHours(randomInt(8, 22), randomInt(0, 59), 0, 0);
  return d.toISOString();
}

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

const statuses: Array<Order["status"]> = [
  "pending", "confirmed", "cancelled", "no_response",
];

export function generateDemoOrders(count: number = 60): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[randomInt(0, 3)];

    orders.push({
      id: `demo-${String(i + 1).padStart(4, "0")}`,
      store_id: "demo-store",
      customer_name: `${pick(customerFirstNames)} ${pick(customerLastNames)}`,
      phone: `+213 5${randomInt(50, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
      product: pick(products),
      amount: randomInt(800, 12000),
      status,
      wilaya: pick(wilayas),
      commune: `${pick(wilayas)} Centre`,
      notes: status === "cancelled" ? "Client non joignable" : "",
      created_at: randomDate(45),
    });
  }

  return orders.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export interface DemoStats {
  total: number;
  confirmed: number;
  cancelled: number;
  noResponse: number;
  pending: number;
  confirmationRate: number;
  revenue: number;
  deliverySavings: number;
}

export function computeDemoStats(orders: Order[]): DemoStats {
  const total = orders.length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const noResponse = orders.filter((o) => o.status === "no_response").length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmationRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  const revenue = orders
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.amount, 0);
  const deliverySavings = Math.round(revenue * 0.15);

  return { total, confirmed, cancelled, noResponse, pending, confirmationRate, revenue, deliverySavings };
}
