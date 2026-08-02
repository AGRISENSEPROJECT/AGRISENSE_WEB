import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface YieldChartProps {
  /** Category labels (e.g. soil types or crops). */
  labels?: string[]
  /** Values per label. */
  values?: number[]
  seriesLabel?: string
}

export function YieldChart({
  labels = ["Wheat", "Corn", "Soybean", "Rice"],
  values = [85, 78, 92, 65],
  seriesLabel = "Count",
}: YieldChartProps) {
  const options = {
    responsive: true,
    plugins: { legend: { position: "bottom" as const } },
    scales: { y: { beginAtZero: true } },
    maintainAspectRatio: false,
  }

  const data = {
    labels,
    datasets: [
      {
        label: seriesLabel,
        data: values,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
    ],
  }

  if (labels.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-400">
        No data to display yet.
      </div>
    )
  }

  return (
    <div className="h-64">
      <Bar options={options} data={data} />
    </div>
  )
}
