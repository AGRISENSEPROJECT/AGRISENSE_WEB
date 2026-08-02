import { useEffect } from "react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge } from "../ui";
import { SUPPLIER_ACCENT, supplierLinks } from "./config";
import { supplierOrders } from "./mock";

const statusColor: Record<string, "green" | "amber" | "red" | "blue"> = {
  pending: "amber",
  processing: "blue",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

const SupplierOrders = () => {
  useEffect(() => {
    document.title = "Orders | Supplier | AGRISENSE";
  }, []);

  return (
    <RoleLayout
      links={supplierLinks}
      roleLabel="Supplier Portal"
      accent={SUPPLIER_ACCENT}
      title="Orders"
      subtitle="Review and fulfil incoming buyer orders."
    >
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-gray-400">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Buyer</th>
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Qty</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {supplierOrders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{o.id}</td>
                  <td className="py-3 text-gray-700">{o.buyer}</td>
                  <td className="py-3 text-gray-500">{o.product}</td>
                  <td className="py-3 text-gray-600">{o.qty}</td>
                  <td className="py-3 font-semibold text-gray-800">${o.total}</td>
                  <td className="py-3 text-gray-500">{o.date}</td>
                  <td className="py-3">
                    <Badge color={statusColor[o.status]}>{o.status}</Badge>
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

export default SupplierOrders;
