import { useEffect } from "react";
import { Plus } from "lucide-react";
import RoleLayout from "../RoleLayout";
import { Panel, Badge } from "../ui";
import { NGO_ACCENT, ngoLinks } from "./config";
import { ngoPrograms } from "./mock";

const statusColor: Record<string, "green" | "amber" | "gray"> = {
  active: "green",
  planned: "amber",
  completed: "gray",
};

const NgoPrograms = () => {
  useEffect(() => {
    document.title = "Programs | NGO/Gov | AGRISENSE";
  }, []);

  return (
    <RoleLayout
      links={ngoLinks}
      roleLabel="NGO / Government"
      accent={NGO_ACCENT}
      title="Programs"
      subtitle="Plan, fund and track agricultural programs."
      actions={
        <button
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: NGO_ACCENT }}
        >
          <Plus className="h-4 w-4" /> New Program
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ngoPrograms.map((p) => (
          <Panel key={p.id}>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
              <Badge color={statusColor[p.status]}>{p.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-gray-500">{p.region}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Farmers</p>
                <p className="font-semibold text-gray-800">{p.farmers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Budget</p>
                <p className="font-semibold text-gray-800">${p.budget.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{p.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${p.progress}%`, backgroundColor: NGO_ACCENT }}
                />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </RoleLayout>
  );
};

export default NgoPrograms;
