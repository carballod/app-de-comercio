import fs from "fs/promises";
import path from "path";
import { IOrderRepository } from "../../application/repository/order.repository";
import { Order } from "../order/order.interface";

const ordersFile = path.join(__dirname, "../../../data/orders.json");

export class OrderJsonRepository implements IOrderRepository {
  private async readOrders(): Promise<Order[]> {
    const data = await fs.readFile(ordersFile, "utf-8");
    return JSON.parse(data);
  }

  private async writeOrders(orders: Order[]): Promise<void> {
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
  }

  async findAll(): Promise<Order[]> {
    return this.readOrders();
  }

  async findById(id: string): Promise<Order | null> {
    const orders = await this.readOrders();
    return orders.find((order) => order.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await this.readOrders();
    return orders.filter((order) => order.userId === userId);
  }

  async save(order: Omit<Order, "id">): Promise<Order> {
    const orders = await this.readOrders();
    const newOrder = { ...order, id: Date.now().toString() };
    orders.push(newOrder);
    await this.writeOrders(orders);
    return newOrder;
  }

  async update(
    id: string,
    orderData: Partial<Omit<Order, "id">>
  ): Promise<Order | null> {
    const orders = await this.readOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return null;

    if (typeof orderData.totalAmount === 'string') {
      orderData.totalAmount = parseFloat(orderData.totalAmount);
    }

    if (orderData.products) {
      orderData.products = orderData.products.map(product => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
      }));
    }

    orders[index] = { ...orders[index], ...orderData };
    await this.writeOrders(orders);
    return orders[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const orders = await this.readOrders();
    const filteredOrders = orders.filter((order) => order.id !== id);
    if (filteredOrders.length === orders.length) return false;

    await this.writeOrders(filteredOrders);
    return true;
  }

  async cancelOrder(id: string): Promise<Order | null> {
    const orders = await this.readOrders();
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) return null;

    orders[orderIndex].status = "cancelled";
    await this.writeOrders(orders);
    return orders[orderIndex];
  }
}
