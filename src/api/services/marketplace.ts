import { api } from "../client";
import type {
  CreateMarketplaceOrderDto,
  MarketplaceOrder,
  MarketplaceOrdersResponse,
  MarketplaceProduct,
  MarketplaceProductsResponse,
} from "../types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const marketplaceService = {
  getProducts: (
    params: { page?: number; limit?: number; category?: string } = { page: 1, limit: 20 },
  ) => api.get<MarketplaceProductsResponse>(`/marketplace/products${buildQuery(params)}`),

  getProduct: (id: string) => api.get<MarketplaceProduct>(`/marketplace/products/${id}`),

  getMatchedProducts: (farmId: string, recommendationIds: string[]) =>
    api.get<MarketplaceProductsResponse>(
      `/marketplace/matched-products${buildQuery({
        farmId,
        recommendationIds: recommendationIds.join(","),
      })}`,
    ),

  createOrder: (dto: CreateMarketplaceOrderDto) =>
    api.post<MarketplaceOrder>("/marketplace/orders", dto),

  getOrders: () => api.get<MarketplaceOrdersResponse>("/marketplace/orders"),
};
