import SideBar from "../SideBar"
import Navbar from "../Navbar"
import { SoilTypeCards } from "./soil-type-cards"
import { SoilGrowthChart } from "./soil-growth-chart"
import { CropTimeline } from "./crop-timeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import {
  ApiError,
  predictionService,
  type CreatePredictionDto,
  type PredictionRun,
  type Recommendation,
} from "@/api"
import { useFarms } from "@/hooks/useFarms"

type RunForm = {
  temperature: string
  humidity: string
  rainfall: string
  nitrogen: string
  phosphorus: string
  potassium: string
  crop_type: string
  phLevel: string
}

const emptyRunForm: RunForm = {
  temperature: "",
  humidity: "",
  rainfall: "",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  crop_type: "",
  phLevel: "",
}

const SoilDetects = () => {
  const { farms } = useFarms()
  const [farmId, setFarmId] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const [form, setForm] = useState<RunForm>(emptyRunForm)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [runs, setRuns] = useState<PredictionRun[]>([])
  const [loadingRuns, setLoadingRuns] = useState(false)

  useEffect(() => {
    document.title = 'Soil Detection | AGRISENSE'
  }, [])

  useEffect(() => {
    if (!farmId && farms.length > 0) setFarmId(farms[0].id)
  }, [farms, farmId])

  const loadRuns = useCallback(async () => {
    setLoadingRuns(true)
    try {
      const res = await predictionService.getRuns({
        farmId: farmId || undefined,
        limit: 5,
      })
      const list = (res.data || res.items || (Array.isArray(res) ? res : [])) as PredictionRun[]
      setRuns(Array.isArray(list) ? list : [])
    } catch {
      setRuns([])
    } finally {
      setLoadingRuns(false)
    }
  }, [farmId])

  useEffect(() => {
    loadRuns()
  }, [loadRuns])

  const update = (key: keyof RunForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!farmId) {
      setError("Please select a farm. You can add one in Settings → Farm Management.")
      return
    }
    if (!image) {
      setError("Please upload a soil image.")
      return
    }

    const dto: CreatePredictionDto = {
      image,
      farmId,
      source: "image",
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      rainfall: Number(form.rainfall),
      nitrogen: Number(form.nitrogen),
      phosphorus: Number(form.phosphorus),
      potassium: Number(form.potassium),
      crop_type: form.crop_type || undefined,
      phLevel: form.phLevel ? Number(form.phLevel) : undefined,
    }

    setRunning(true)
    try {
      await predictionService.run(dto)
      setMessage("Soil analysis completed successfully.")
      setForm(emptyRunForm)
      setImage(null)
      await loadRuns()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Prediction failed.")
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 flex flex-col overflow-auto bg-white">
        <Navbar />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-gray-800">Soil Detects</h1>
          </div>

          {/* Run soil analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Run Soil Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
                  {message}
                </div>
              )}

              <form onSubmit={handleRun} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Farm">
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
                  >
                    <option value="">Select a farm</option>
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Soil image">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-green-100 file:text-[#2C6E49] file:font-semibold"
                  />
                </FormField>

                <FormField label="Crop type">
                  <input
                    value={form.crop_type}
                    onChange={(e) => update("crop_type", e.target.value)}
                    placeholder="e.g. Tomatoes"
                    className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
                  />
                </FormField>

                <NumberField label="Temperature (°C)" value={form.temperature} onChange={(v) => update("temperature", v)} required />
                <NumberField label="Humidity (%)" value={form.humidity} onChange={(v) => update("humidity", v)} required />
                <NumberField label="Rainfall (mm)" value={form.rainfall} onChange={(v) => update("rainfall", v)} required />
                <NumberField label="Nitrogen (mg/kg)" value={form.nitrogen} onChange={(v) => update("nitrogen", v)} required />
                <NumberField label="Phosphorus (mg/kg)" value={form.phosphorus} onChange={(v) => update("phosphorus", v)} required />
                <NumberField label="Potassium (mg/kg)" value={form.potassium} onChange={(v) => update("potassium", v)} required />
                <NumberField label="Soil pH" value={form.phLevel} onChange={(v) => update("phLevel", v)} />

                <div className="md:col-span-3">
                  <button
                    type="submit"
                    disabled={running}
                    className="bg-[#2C6E49] hover:bg-[#23583a] text-white font-semibold text-sm px-6 py-2.5 rounded-md transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {running && <Loader2 className="h-4 w-4 animate-spin" />}
                    {running ? "Analyzing…" : "Run analysis"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent runs & recommendations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Analysis & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRuns ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2C6E49]" />
                </div>
              ) : runs.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                  No analysis runs yet. Run your first soil analysis above.
                </p>
              ) : (
                <div className="space-y-4">
                  {runs.map((run) => (
                    <div key={run.id} className="border rounded-md p-4">
                      <p className="text-xs text-gray-400 mb-2">
                        {run.createdAt ? new Date(run.createdAt).toLocaleString() : run.id}
                      </p>
                      {Array.isArray(run.recommendations) && run.recommendations.length > 0 ? (
                        <ul className="space-y-1.5">
                          {run.recommendations.map((rec: Recommendation) => (
                            <li key={rec.id} className="text-sm text-gray-700">
                              <span className="font-semibold capitalize text-[#2C6E49]">
                                {rec.type}:
                              </span>{" "}
                              {rec.title || rec.description || rec.content || "—"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No recommendations recorded.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <SoilTypeCards />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Soil Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <SoilGrowthChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Planting Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <CropTimeline />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 block">{label}</label>
      {children}
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <FormField label={label}>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
      />
    </FormField>
  )
}

export default SoilDetects
