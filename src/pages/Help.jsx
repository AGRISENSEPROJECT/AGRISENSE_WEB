import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I confirm a new order?",
    a: "Open the Orders page, find the order with a Pending status, and confirm it. The buyer is notified automatically and the quantity is reserved from your inventory.",
  },
  {
    q: "How is my fulfillment rate calculated?",
    a: "Fulfillment rate is the share of orders delivered on or before the promised delivery date over the past 90 days.",
  },
  {
    q: "What happens when stock falls below the reorder level?",
    a: "The product is flagged as Low stock on the Inventory page and counted in the low stock alerts KPI so you can restock before running out.",
  },
  {
    q: "How do I update my delivery schedule?",
    a: "Go to Deliveries and edit the ETA on any scheduled shipment. Buyers see the updated ETA immediately.",
  },
];

export default function Help() {
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-leaf">Help & Support</h1>
      <p className="mt-1 text-sm text-muted">Frequently asked questions and support</p>

      <div className="card mt-6 divide-y divide-gray-100 p-2">
        {faqs.map((faq, i) => (
          <div key={faq.q}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold"
            >
              {faq.q}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-muted">{faq.a}</p>}
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-sm font-bold">Contact support</h2>
        <div className="mt-4 flex flex-col gap-4">
          <input
            placeholder="Subject"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-leaf"
          />
          <textarea
            placeholder="Describe your issue..."
            rows={4}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-leaf"
          />
          <button className="self-start rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-white shadow hover:bg-forest-dark">
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}
