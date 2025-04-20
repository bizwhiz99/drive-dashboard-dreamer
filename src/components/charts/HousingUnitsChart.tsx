
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

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

    // Group by date
    const groupedData = filteredData.reduce((acc: Record<string, any>, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = {
          date: new Date(date), // Parse date string to Date object
          owned_units: 0,
          rental_units: 0
        };
      }
      
      // Sum up units by type - we'll average later if there's more than one city
      acc[date].owned_units += parseFloat(item.owned_units) || 0;
      acc[date].rental_units += parseFloat(item.rental_units) || 0;
      
      return acc;
    }, {});
    
    // If we're showing all cities, we need to average the data
    if (selectedCity === 'all') {
      const uniqueCities = new Set(data.map(item => item.city)).size;
      if (uniqueCities > 0) {
        Object.keys(groupedData).forEach(date => {
          groupedData[date].owned_units = Math.round(groupedData[date].owned_units / uniqueCities);
          groupedData[date].rental_units = Math.round(groupedData[date].rental_units / uniqueCities);
        });
      }
    }
    
    // Convert to array and sort chronologically
    return Object.values(groupedData)
      .sort((a: any, b: any) => a.date - b.date);
  }, [data, selectedCity]);

  const cities = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.city)));
  }, [data]);

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toLocaleString()}k`;
  };

  const formatXAxis = (date: Date) => {
    return format(new Date(date), 'MMM yyyy');
  };

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
                left: 60,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                angle={-45} 
                textAnchor="end" 
                height={60}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickFormatter={formatYAxis}
                label={{ value: 'Housing Units (thousands)', angle: -90, position: 'insideLeft', offset: 10 }}
                width={80}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(label) => format(new Date(label), 'MMMM yyyy')}
                formatter={(value: number) => [value.toLocaleString(), '']}
              />
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
