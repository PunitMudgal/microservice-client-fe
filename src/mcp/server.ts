import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";
const AUTH_COOKIE = process.env.AUTH_COOKIE || "";

const CATALOG_SERVICE = "/catalog/api/v1";
const ORDER_SERVICE = "/order/api/v1";

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BACKEND_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(AUTH_COOKIE ? { Cookie: AUTH_COOKIE } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

const server = new McpServer({
  name: "nesta-foods-mcp",
  version: "1.0.0",
});

server.registerTool(
  "search_menu",
  {
    description: "Search the restaurant menu by product name or category name",
    inputSchema: {
      query: z.string().describe("Search term to filter menu items"),
    },
  },
  async ({ query }) => {
    const menu = await apiFetch<Array<{
      id: string;
      name: string;
      slug: string;
      products?: Array<{
        id: string;
        name: string;
        description?: string;
        isVeg?: boolean;
        variants: Array<{ label: string; price: string }>;
      }>;
    }>>(`${CATALOG_SERVICE}/${TENANT_ID}/menu`);

    const q = query.toLowerCase();
    const results: Array<{ category: string; name: string; description?: string; isVeg?: boolean; variants: Array<{ label: string; price: string }> }> = [];

    for (const category of menu) {
      if (category.name.toLowerCase().includes(q)) {
        for (const product of category.products || []) {
          results.push({
            category: category.name,
            name: product.name,
            description: product.description || undefined,
            isVeg: product.isVeg ?? undefined,
            variants: product.variants,
          });
        }
      } else {
        for (const product of category.products || []) {
          if (product.name.toLowerCase().includes(q)) {
            results.push({
              category: category.name,
              name: product.name,
              description: product.description || undefined,
              isVeg: product.isVeg ?? undefined,
              variants: product.variants,
            });
          }
        }
      }
    }

    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  },
);

server.registerTool(
  "get_menu",
  {
    description: "Get the full restaurant menu with all categories and products",
    inputSchema: {},
  },
  async () => {
    const menu = await apiFetch<Array<{
      name: string;
      products: Array<{
        name: string;
        description?: string;
        isVeg?: boolean;
        variants: Array<{ label: string; price: string }>;
      }>;
    }>>(`${CATALOG_SERVICE}/${TENANT_ID}/menu`);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(menu, null, 2) }],
    };
  },
);

server.registerTool(
  "list_user_orders",
  {
    description: "List all orders for the current user with optional status filter",
    inputSchema: {
      status: z.enum(["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]).optional().describe("Filter by order status"),
      limit: z.number().optional().describe("Number of orders to return (default 10)"),
    },
  },
  async ({ status, limit }) => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (limit) params.limit = String(limit);

    const result = await apiFetch<{
      items: Array<{
        id: string;
        orderNumber: string;
        status: string;
        orderType: string;
        grandTotal: string;
        placedAt: string;
      }>;
      total: number;
    }>(`${ORDER_SERVICE}/orders`, params);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.registerTool(
  "get_order",
  {
    description: "Get detailed information about a specific order including items and status history",
    inputSchema: {
      orderId: z.string().describe("The order ID to look up"),
    },
  },
  async ({ orderId }) => {
    const order = await apiFetch<{
      id: string;
      orderNumber: string;
      status: string;
      orderType: string;
      grandTotal: string;
      items: Array<{
        productName: string;
        variantLabel: string;
        quantity: number;
        lineTotal: string;
      }>;
      statusHistory: Array<{
        status: string;
        changedBy: string;
        createdAt: string;
      }>;
    }>(`${ORDER_SERVICE}/orders/${orderId}`);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(order, null, 2) }],
    };
  },
);

server.registerTool(
  "get_order_status",
  {
    description: "Get the current status of a specific order",
    inputSchema: {
      orderId: z.string().describe("The order ID to check status for"),
    },
  },
  async ({ orderId }) => {
    const order = await apiFetch<{
      orderNumber: string;
      status: string;
      statusHistory: Array<{
        status: string;
        createdAt: string;
      }>;
    }>(`${ORDER_SERVICE}/orders/${orderId}`);

    return {
      content: [{ type: "text" as const, text: JSON.stringify({
        orderNumber: order.orderNumber,
        status: order.status,
        history: order.statusHistory,
      }, null, 2) }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
