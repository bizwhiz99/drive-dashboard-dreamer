
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate, formatNumberWithK } from "@/utils/formatters";

interface HousingUnitsChartProps {
  data: any[];
}

const HousingUnitsChart: React.FC<HousingUnitsChartProps> = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Filter data to ensure all records have valid date, owned_units, and rental_units
  const validData = React.useMemo(() => {
    let filtered = filterValidData(data, ['owned_units', 'rental_units']);
    // The filterValidData function now handles date validation and sorting
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity);
    }
    
    return filtered;
  }, [data, selectedCity]);

  // Get unique cities for the chart
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
              data={validData}
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
                tickFormatter={(value) => safeFormatDate(value, formatDateMonthYear)}
                angle={-45} 
                textAnchor="end" 
                height={60}
                interval="preserveStartEnd"
                minTickGap={30}
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis 
                tickFormatter={formatNumberWithK}
                domain={['auto', 'auto']}
                label={{ value: 'Housing Units', angle: -90, position: 'insideLeft', offset: -30 }}
                width={80}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
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
