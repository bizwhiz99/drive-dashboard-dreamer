
import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface HousingPriceIndexChartProps {
  data: any[];
}

const HousingPriceIndexChart: React.FC<HousingPriceIndexChartProps> = ({ data }) => {
  // Process data for the chart
  const chartData = React.useMemo(() => {
    // Group by year and quarter to create time labels
    const groupedData = data.reduce((acc: Record<string, any>, item) => {
      const timeKey = `${item.year}-Q${item.quarter}`;
      if (!acc[timeKey]) {
        acc[timeKey] = {
          time: timeKey,
          year: item.year,
          quarter: item.quarter
        };
      }
      
      // Track housing price index by city
      acc[timeKey][`${item.city}_hpi`] = item.hpi;
      
      return acc;
    }, {});
    
    // Convert to array and sort chronologically
    return Object.values(groupedData)
      .sort((a: any, b: any) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.quarter - b.quarter;
      });
  }, [data]);

  const cities = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.city)));
  }, [data]);

  const cityColors: Record<string, string> = {
    "San Francisco": "#8B5CF6", // Vivid purple
    "Austin": "#F97316", // Bright orange
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
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            interval={Math.floor(chartData.length / 10)} // Show fewer labels for readability
          />
          <YAxis 
            label={{ value: 'Housing Price Index', angle: -90, position: 'insideLeft' }}
            width={80}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend verticalAlign="top" />
          
          {cities.map((city) => (
            <Line
              key={city}
              type="monotone"
              dataKey={`${city}_hpi`}
              name={city}
              stroke={cityColors[city] || "#8884d8"}
              activeDot={{ r: 8 }}
              dot={{ r: 3 }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default HousingPriceIndexChart;
