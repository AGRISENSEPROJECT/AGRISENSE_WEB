import { useEffect } from "react";
import RoleLayout from "../RoleLayout";
import { Panel } from "../ui";
import { NGO_ACCENT, ngoLinks } from "./config";
import { ngoRegions } from "./mock";

const NgoRegions = () => {
  useEffect(() => {
    document.title = "Regions | NGO/Gov | AGRISENSE";
  }, []);

  const totalFarmers = ngoRegions.reduce((s, r) => s + r.farmers, 0);
  const totalHectares = ngoRegions.reduce((s, r) => s + r.hectares, 0);

  return (
    <RoleLayout
      links={ngoLinks}
      roleLabel="NGO / Government"
      accent={NGO_ACCENT}
      title="Regional Coverage"
      subtitle="Reach and land area monitored across regions."
    >
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-gray-400">
                <th className="pb-2 font-medium">Region</th>
                <th className="pb-2 font-medium">Farmers</th>
                <th className="pb-2 font-medium">Hectares</th>
                <th className="pb-2 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {ngoRegions.map((r) => (
                <tr key={r.region} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-800">{r.region}</td>
                  <td className="py-3 text-gray-600">{r.farmers.toLocaleString()}</td>
                  <td className="py-3 text-gray-600">{r.hectares.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.round((r.farmers / totalFarmers) * 100)}%`,
                            backgroundColor: NGO_ACCENT,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((r.farmers / totalFarmers) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold text-gray-800">
                <td className="pt-3">Total</td>
                <td className="pt-3">{totalFarmers.toLocaleString()}</td>
                <td className="pt-3">{totalHectares.toLocaleString()}</td>
                <td className="pt-3">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </RoleLayout>
  );
};

export default NgoRegions;
