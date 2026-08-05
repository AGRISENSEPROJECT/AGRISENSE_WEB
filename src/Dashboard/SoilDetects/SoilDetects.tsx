import { useEffect } from "react";
import { Smartphone, Download } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ANDROID_URL =
  import.meta.env.VITE_ANDROID_APP_URL?.trim() ||
  "https://play.google.com/store/search?q=AgriSense&c=apps";
const IOS_URL =
  import.meta.env.VITE_IOS_APP_URL?.trim() ||
  "https://apps.apple.com/search?term=AgriSense";

/** Soil detection runs on the mobile app only — web shows a download prompt. */
const SoilDetects = () => {
  useEffect(() => {
    document.title = "Soil Detection | AGRISENSE";
  }, []);

  return (
    <DashboardLayout>
      <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-lg border-gray-100 shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2C6E49]/10">
              <Smartphone className="h-7 w-7 text-[#2C6E49]" />
            </div>
            <CardTitle className="text-xl text-gray-900">Soil detection on mobile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm leading-relaxed text-gray-500">
              Soil image analysis and field readings are available in the AgriSense mobile app —
              not on the web dashboard.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href={ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2C6E49] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245a3c]"
              >
                <Download className="h-4 w-4" />
                Google Play
              </a>
              <a
                href={IOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
                App Store
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SoilDetects;
