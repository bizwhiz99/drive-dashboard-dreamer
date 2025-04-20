
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

interface CityComparisonCardProps {
  data: any[];
}

const CityComparisonCard: React.FC<CityComparisonCardProps> = ({ data }) => {
  // Get the most recent data for each city
  const cityMetrics = React.useMemo(() => {
    const cityMap = new Map<string, any>();
    
    data.forEach(item => {
      const city = item.city;
      const existingItem = cityMap.get(city);
      
      // If we don't have an entry for this city yet, or this entry is more recent
      if (!existingItem || 
          (item.year > existingItem.year) || 
          (item.year === existingItem.year && item.quarter > existingItem.quarter)) {
        cityMap.set(city, {
          city,
          airbnb_activity: parseFloat(item.airbnb_activity) || 0,
          airbnb_ratio: parseFloat(item.airbnb_ratio) || 0,
          hpi: parseFloat(item.hpi) || 0,
          median_rent: parseFloat(item.median_rent) || 0,
          ownership_rate: parseFloat(item.ownership_rate) || 0,
          rental_rate: parseFloat(item.rental_rate) || 0,
          unemployment: parseFloat(item.unemployment) || 0,
          median_income: parseFloat(item.median_income) || 0,
          period: `${item.year}-Q${item.quarter}`
        });
      }
    });
    
    return Array.from(cityMap.values());
  }, [data]);

  // Calculate growth metrics - get first and last data points for each city
  const growthMetrics = React.useMemo(() => {
    const cityMap = new Map<string, { first: any; last: any }>();
    
    data.forEach(item => {
      const city = item.city;
      if (!cityMap.has(city)) {
        cityMap.set(city, { first: item, last: item });
        return;
      }
      
      const entry = cityMap.get(city)!;
      
      // Check if this is an earlier entry
      if (item.year < entry.first.year || 
          (item.year === entry.first.year && item.quarter < entry.first.quarter)) {
        entry.first = item;
      }
      
      // Check if this is a later entry
      if (item.year > entry.last.year || 
          (item.year === entry.last.year && item.quarter > entry.last.quarter)) {
        entry.last = item;
      }
    });
    
    // Calculate growth percentages
    return Array.from(cityMap.entries()).map(([city, { first, last }]) => {
      const calculateGrowth = (metric: string) => {
        const firstVal = parseFloat(first[metric]) || 0;
        const lastVal = parseFloat(last[metric]) || 0;
        if (firstVal === 0) return 0;
        return ((lastVal - firstVal) / firstVal) * 100;
      };
      
      return {
        city,
        airbnb_growth: calculateGrowth('airbnb_activity'),
        hpi_growth: calculateGrowth('hpi'),
        rent_growth: calculateGrowth('median_rent'),
        period_start: `${first.year}-Q${first.quarter}`,
        period_end: `${last.year}-Q${last.quarter}`
      };
    });
  }, [data]);
  
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No data available</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Current Key Metrics by City</CardTitle>
          <CardDescription>Most recent values for each city</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Airbnb Ratio</TableHead>
                <TableHead className="text-right">Housing Price Index</TableHead>
                <TableHead className="text-right">Median Rent</TableHead>
                <TableHead className="text-right">Median Income</TableHead>
                <TableHead className="text-right">Unemployment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cityMetrics.map((item) => (
                <TableRow key={item.city}>
                  <TableCell className="font-medium">{item.city}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell className="text-right">{item.airbnb_ratio.toFixed(4)}</TableCell>
                  <TableCell className="text-right">{item.hpi.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.median_rent.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.median_income.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.unemployment.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Analysis by City</CardTitle>
          <CardDescription>Change in key metrics over the entire data period</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Airbnb Growth</TableHead>
                <TableHead className="text-right">HPI Growth</TableHead>
                <TableHead className="text-right">Rent Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthMetrics.map((item) => (
                <TableRow key={item.city}>
                  <TableCell className="font-medium">{item.city}</TableCell>
                  <TableCell>{item.period_start} to {item.period_end}</TableCell>
                  <TableCell className="text-right">
                    {item.airbnb_growth.toFixed(1)}%
                    {item.airbnb_growth > 0 ? (
                      <ArrowUp className="inline ml-1 text-green-500" size={16} />
                    ) : (
                      <ArrowDown className="inline ml-1 text-red-500" size={16} />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.hpi_growth.toFixed(1)}%
                    {item.hpi_growth > 0 ? (
                      <ArrowUp className="inline ml-1 text-green-500" size={16} />
                    ) : (
                      <ArrowDown className="inline ml-1 text-red-500" size={16} />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.rent_growth.toFixed(1)}%
                    {item.rent_growth > 0 ? (
                      <ArrowUp className="inline ml-1 text-green-500" size={16} />
                    ) : (
                      <ArrowDown className="inline ml-1 text-red-500" size={16} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default CityComparisonCard;
