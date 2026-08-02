import { useEffect } from "react";
import { Plus } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge } from "../ui";
import { SUPPLIER_ACCENT, supplierLinks } from "./config";
import { supplierProducts } from "./mock";

const statusMap: Record<string, { color: "green" | "amber" | "red"; label: string }> = {
  in_stock: { color: "green", label: "In stock" },
  low_stock: { color: "amber", label: "Low stock" },
  out_of_stock: { color: "red", label: "Out of stock" },
};

const SupplierProducts = () => {
  useEffect(() => {
    document.title = "Products | Supplier | AGRISENSE";
  }, []);

  return (
    <RoleLayout
      links={supplierLinks}
      roleLabel="Supplier Portal"
      accent={SUPPLIER_ACCENT}
      title="Products"
      subtitle="Manage your catalogue and stock levels."
      actions={
        <button
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: SUPPLIER_ACCENT }}
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      }
    >
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-gray-400">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Stock</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {supplierProducts.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{p.id}</td>
                  <td className="py-3 text-gray-700">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.category}</td>
                  <td className="py-3 font-semibold text-gray-800">${p.price.toFixed(2)}</td>
                  <td className="py-3 text-gray-600">
                    {p.stock} {p.unit}
                  </td>
                  <td className="py-3">
                    <Badge color={statusMap[p.status].color}>{statusMap[p.status].label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </RoleLayout>
  );
};

export default SupplierProducts;
