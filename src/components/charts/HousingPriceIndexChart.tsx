import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface HousingPriceIndexChartProps {
  data: any[];
}

const HousingPriceIndexChart: React.FC<HousingPriceIndexChartProps> = ({ data }) => {
  // Process data for the chart
  const chartData = React.useMemo(() => {
    // Filter to only include December data points or the latest available month for each year
    const yearMap: Record<number, Record<string, any>> = {};
    
    data.forEach(item => {
      if (!item.year || !item.quarter || !item.hpi || !item.city) return;
      
      const year = item.year;
      const quarter = item.quarter;
      const timeKey = `${year}-Q${quarter}`;
      
      // Initialize year entry if it doesn't exist
      if (!yearMap[year]) {
        yearMap[year] = {};
      }
      
      // For each year, keep the Q4 (or highest available quarter) for each city
      if (!yearMap[year][item.city] || quarter > yearMap[year][item.city].quarter) {
        yearMap[year][item.city] = {
          timeKey,
          year,
          quarter,
          city: item.city,
          hpi: item.hpi
        };
      }
    });
    
    // Convert the nested map to a flat array of data points
    const flattenedData: Record<string, any>[] = [];
    
    Object.values(yearMap).forEach(cityEntries => {
      const yearData: Record<string, any> = {};
      
      Object.values(cityEntries).forEach(entry => {
        if (!yearData.time) {
          yearData.time = entry.timeKey;
          yearData.year = entry.year;
          yearData.quarter = entry.quarter;
        }
        
        // Add city-specific HPI
        yearData[`${entry.city}_hpi`] = entry.hpi;
      });
      
      flattenedData.push(yearData);
    });
    
    // Sort chronologically
    return flattenedData.sort((a, b) => {
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
            minTickGap={30} 
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
