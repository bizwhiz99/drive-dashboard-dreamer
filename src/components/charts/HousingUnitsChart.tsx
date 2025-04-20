
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HousingUnitsChartProps {
  data: any[];
}

const HousingUnitsChart: React.FC<HousingUnitsChartProps> = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Process data for the chart
  const chartData = React.useMemo(() => {
    // Filter by selected city first, if applicable
    let filteredData = data;
    if (selectedCity !== 'all') {
      filteredData = data.filter(item => item.city === selectedCity);
    }

    // Group by year and quarter to create time labels
    const groupedData = filteredData.reduce((acc: Record<string, any>, item) => {
      const timeKey = `${item.year}-Q${item.quarter}`;
      if (!acc[timeKey]) {
        acc[timeKey] = {
          time: timeKey,
          year: item.year,
          quarter: item.quarter,
          owned_units: 0,
          rental_units: 0
        };
      }
      
      // Sum up units by type - we'll average later if there's more than one city
      acc[timeKey].owned_units += parseFloat(item.owned_units) || 0;
      acc[timeKey].rental_units += parseFloat(item.rental_units) || 0;
      
      return acc;
    }, {});
    
    // If we're showing all cities, we need to average the data
    if (selectedCity === 'all') {
      const uniqueCities = new Set(data.map(item => item.city)).size;
      if (uniqueCities > 0) {
        Object.keys(groupedData).forEach(timeKey => {
          groupedData[timeKey].owned_units /= uniqueCities;
          groupedData[timeKey].rental_units /= uniqueCities;
        });
      }
    }
    
    // Convert to array and sort chronologically
    return Object.values(groupedData)
      .sort((a: any, b: any) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.quarter - b.quarter;
      });
  }, [data, selectedCity]);

  const cities = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.city)));
  }, [data]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 w-48">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <ChartContainer 
          config={{
            "owned_units": { color: "#8B5CF6" }, // Purple for owned units
            "rental_units": { color: "#F97316" }, // Orange for rental units
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
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
                label={{ value: 'Housing Units', angle: -90, position: 'insideLeft' }}
                width={80}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="rental_units" 
                name="Rental Units" 
                stackId="1" 
                stroke="#F97316" 
                fill="#F97316" 
              />
              <Area 
                type="monotone" 
                dataKey="owned_units" 
                name="Owned Units" 
                stackId="1" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default HousingUnitsChart;
