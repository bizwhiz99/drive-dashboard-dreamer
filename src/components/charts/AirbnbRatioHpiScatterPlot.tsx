
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate } from "@/utils/formatters";

interface AirbnbRatioHpiScatterPlotProps {
  data: any[];
}

const AirbnbRatioHpiScatterPlot: React.FC<AirbnbRatioHpiScatterPlotProps> = ({ data }) => {
  // Filter data to ensure all records have valid airbnb_ratio and hpi values
  const validData = React.useMemo(() => {
    return filterValidData(data, ['airbnb_ratio', 'hpi']);
  }, [data]);

  // Get unique cities for the chart
  const cities = React.useMemo(() => {
    return Array.from(new Set(validData.map(item => item.city)));
  }, [validData]);

  const cityColors: Record<string, string> = {
    "San Francisco": "#8B5CF6", // Vivid purple
    "Austin": "#F97316", // Bright orange
  };

  // Create custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded p-3 shadow-md">
          <div className="font-medium">{data.city}</div>
          <div>{safeFormatDate(data.date, formatDateMonthYear)}</div>
          <div>Airbnb Ratio: {data.airbnb_ratio.toFixed(4)}</div>
          <div>Housing Price Index: {data.hpi.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  if (validData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  return (
    <ChartContainer 
      config={{
        "San Francisco": { color: cityColors["San Francisco"] },
        "Austin": { color: cityColors["Austin"] }
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="airbnb_ratio" 
            name="Airbnb Ratio" 
            label={{ value: 'Airbnb Ratio (% of total housing)', position: 'bottom', offset: 0 }}
          />
          <YAxis 
            type="number" 
            dataKey="hpi" 
            name="Housing Price Index" 
            label={{ value: 'Housing Price Index (HPI)', angle: -90, position: 'insideLeft' }}
            width={80}
          />
          <ZAxis range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {cities.map((city) => (
            <Scatter 
              key={city} 
              name={city} 
              data={validData.filter(item => item.city === city)} 
              fill={cityColors[city] || "#8884d8"} 
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AirbnbRatioHpiScatterPlot;
