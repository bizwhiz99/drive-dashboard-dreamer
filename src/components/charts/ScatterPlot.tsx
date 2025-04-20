
import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScatterPlotProps {
  data: any[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const cities = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.city)));
  }, [data]);
  
  // Transform data for the scatter plot
  const scatterData = React.useMemo(() => {
    return cities.map(city => {
      const cityData = data
        .filter(item => item.city === city)
        .map(item => ({
          x: parseFloat(item.airbnb_ratio) || 0,
          y: parseFloat(item.hpi) || 0,
          city: item.city,
          year: item.year,
          quarter: item.quarter,
          time: `${item.year}-Q${item.quarter}`
        }));
        
      return {
        name: city,
        data: cityData
      };
    });
  }, [data, cities]);

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
          <div>{data.time}</div>
          <div>Airbnb Ratio: {data.x.toFixed(4)}</div>
          <div>Housing Price Index: {data.y.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
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
            dataKey="x" 
            name="Airbnb Ratio" 
            label={{ value: 'Airbnb Ratio (% of total housing)', position: 'bottom', offset: 0 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Housing Price Index" 
            label={{ value: 'Housing Price Index (HPI)', angle: -90, position: 'insideLeft' }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {scatterData.map((cityData, index) => (
            <Scatter 
              key={cityData.name} 
              name={cityData.name} 
              data={cityData.data} 
              fill={cityColors[cityData.name] || "#8884d8"} 
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ScatterPlot;
