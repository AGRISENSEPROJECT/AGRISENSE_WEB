import { useLocation } from "react-router-dom";
import { roleFromPath } from "../data/roles.js";

function Field({ label, value }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <input
        type="text"
        defaultValue={value}
        className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-leaf"
      />
    </label>
  );
}

export default function Settings() {
  const { pathname } = useLocation();
  const role = roleFromPath(pathname);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-leaf">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Your {role.label.toLowerCase()} profile and organization information
      </p>

      <div className="mt-6 flex flex-col gap-6">
        {role.settingsSections.map((section) => (
          <div key={section.title} className="card p-6">
            <h2 className="text-sm font-bold">{section.title}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <Field key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
        ))}

        <div>
          <button className="rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-white shadow hover:bg-forest-dark">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
