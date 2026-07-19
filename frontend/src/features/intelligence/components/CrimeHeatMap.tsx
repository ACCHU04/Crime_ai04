import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import type { HotspotEntry } from "@/types/analytics";
import { KARNATAKA_DISTRICTS } from "@/features/intelligence/constants/karnatakaDistricts";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CrimeHeatMapProps {
  hotspots?: HotspotEntry[];
  isLoading?: boolean;
}

const KARNATAKA_CENTER: [number, number] = [75.71, 12.97];

function getMarkerRadius(count: number, max: number): number {
  if (max === 0) return 4;
  return 4 + (count / max) * 14;
}

function getMarkerColor(count: number, max: number): string {
  const ratio = max > 0 ? count / max : 0;
  if (ratio >= 0.7) return "#ef4444";
  if (ratio >= 0.4) return "#f59e0b";
  return "#22c55e";
}

export function CrimeHeatMap({ hotspots, isLoading }: CrimeHeatMapProps) {
  const districtData = useMemo(() => {
    if (!hotspots) return [];
    return hotspots
      .map((h) => {
        const coords = KARNATAKA_DISTRICTS[h.districtName];
        if (!coords) return null;
        return {
          name: h.districtName,
          count: h.crimeCount,
          coords: coords as [number, number],
        };
      })
      .filter(Boolean) as { name: string; count: number; coords: [number, number] }[];
  }, [hotspots]);

  const maxCount = useMemo(
    () => Math.max(...districtData.map((d) => d.count), 1),
    [districtData],
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crime Heat Map</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="card" count={1} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Crime Heat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16/10" }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: KARNATAKA_CENTER,
              scale: 2800,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter((g) => g.properties.name === "India")
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#1e293b" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
              }
            </Geographies>

            {districtData.map((d) => (
              <Marker key={d.name} coordinates={d.coords}>
                <motion.circle
                  r={getMarkerRadius(d.count, maxCount)}
                  fill={getMarkerColor(d.count, maxCount)}
                  fillOpacity={0.7}
                  stroke={getMarkerColor(d.count, maxCount)}
                  strokeWidth={1}
                  strokeOpacity={0.9}
                  initial={{ r: 0 }}
                  animate={{ r: getMarkerRadius(d.count, maxCount) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> High
          </span>
          <span className="ml-auto">{districtData.length} districts shown</span>
        </div>
      </CardContent>
    </Card>
  );
}
