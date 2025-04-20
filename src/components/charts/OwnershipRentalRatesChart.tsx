
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate } from "@/utils/formatters";

// Colors for different cities and data types
const SF_COLOR_OWNERSHIP = "#F97316"; // orange
const SF_COLOR_RENTAL = "#3B82F6"; // blue
const AUSTIN_COLOR_OWNERSHIP = "#22C55E"; // green
const AUSTIN_COLOR_RENTAL = "#8B5CF6"; // purple

interface OwnershipRentalRatesChartProps {
  data: any[];
}

/**
 * Ownership & Rental Rates chart for San Francisco and Austin
 * - One chart per city
 * - Two lines per chart: ownership rate and rental rate
 * Y axis: 0-1 (decimal percentage)
 * X axis: Time (date)
 */
const OwnershipRentalRatesChart: React.FC<OwnershipRentalRatesChartProps> = ({ data }) => {
  // Prepare chart data - filter for valid data for both cities
  const sfData = React.useMemo(() => {
    return filterValidData(
      data.filter(item => item.city === "San Francisco"),
      ["ownership_rate", "rental_rate"]
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  const austinData = React.useMemo(() => {
    return filterValidData(
      data.filter(item => item.city === "Austin"),
      ["ownership_rate", "rental_rate"]
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  // Calculate date domains for x-axis
  const dateDomainSF = React.useMemo(() => {
    if (sfData.length === 0) return [0, 1] as [number, number];
    const dates = sfData.map(d => d.date.getTime());
    return [Math.min(...dates), Math.max(...dates)] as [number, number];
  }, [sfData]);

  const dateDomainAustin = React.useMemo(() => {
    if (austinData.length === 0) return [0, 1] as [number, number];
    const dates = austinData.map(d => d.date.getTime());
    return [Math.min(...dates), Math.max(...dates)] as [number, number];
  }, [austinData]);

  // Both cities have data?
  const hasBothCities = sfData.length > 0 && austinData.length > 0;

  // Render charts - one for San Francisco and one for Austin if data is available
  return (
    <div className="grid grid-cols-1 gap-8">
      {/* San Francisco Chart */}
      {sfData.length > 0 && (
        <ChartContainer
          config={{
            "Ownership Rate (SF)": { color: SF_COLOR_OWNERSHIP },
            "Rental Rate (SF)": { color: SF_COLOR_RENTAL },
          }}
          className={hasBothCities ? "h-80" : "h-[600px]"}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sfData}
              margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => safeFormatDate(value, formatDateMonthYear)}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
                minTickGap={30}
                type="number"
                domain={dateDomainSF}
                scale="time"
              />
              <YAxis
                domain={[0, 1]}
                label={{
                  value: "Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -40,
                }}
                width={80}
                tickFormatter={v => `${Math.round(v * 100)}%`}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
                formatter={(value, name) => {
                  if (typeof value === "number") {
                    return [`${(value * 100).toFixed(1)}%`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Line
                type="monotone"
                dataKey="ownership_rate"
                name="Ownership Rate (SF)"
                stroke={SF_COLOR_OWNERSHIP}
                dot={false}
                isAnimationActive={false}
                connectNulls={true}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="rental_rate"
                name="Rental Rate (SF)"
                stroke={SF_COLOR_RENTAL}
                dot={false}
                isAnimationActive={false}
                connectNulls={true}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      {/* Austin Chart */}
      {austinData.length > 0 && (
        <ChartContainer
          config={{
            "Ownership Rate (Austin)": { color: AUSTIN_COLOR_OWNERSHIP },
            "Rental Rate (Austin)": { color: AUSTIN_COLOR_RENTAL },
          }}
          className={hasBothCities ? "h-80" : "h-[600px]"}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={austinData}
              margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => safeFormatDate(value, formatDateMonthYear)}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
                minTickGap={30}
                type="number"
                domain={dateDomainAustin}
                scale="time"
              />
              <YAxis
                domain={[0, 1]}
                label={{
                  value: "Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -40,
                }}
                width={80}
                tickFormatter={v => `${Math.round(v * 100)}%`}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
                formatter={(value, name) => {
                  if (typeof value === "number") {
                    return [`${(value * 100).toFixed(1)}%`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Line
                type="monotone"
                dataKey="ownership_rate"
                name="Ownership Rate (Austin)"
                stroke={AUSTIN_COLOR_OWNERSHIP}
                dot={false}
                isAnimationActive={false}
                connectNulls={true}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="rental_rate"
                name="Rental Rate (Austin)"
                stroke={AUSTIN_COLOR_RENTAL}
                dot={false}
                isAnimationActive={false}
                connectNulls={true}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
};

export default OwnershipRentalRatesChart;
