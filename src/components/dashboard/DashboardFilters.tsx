
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface DashboardFiltersProps {
  selectedCity: string;
  selectedYear: string;
  selectedQuarter: string;
  availableCities: string[];
  availableYears: number[];
  onCityChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onQuarterChange: (value: string) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedCity,
  selectedYear,
  selectedQuarter,
  availableCities,
  availableYears,
  onCityChange,
  onYearChange,
  onQuarterChange,
}) => {
  const resetFilters = () => {
    onCityChange('all');
    onYearChange('all');
    onQuarterChange('all');
    toast("Filters reset", {
      description: "Displaying all available data.",
      duration: 2000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter size={20} />
          Data Filters
        </CardTitle>
        <CardDescription>Filter the dashboard by city, year, and quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {availableCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quarter">Quarter</Label>
            <Select value={selectedQuarter} onValueChange={onQuarterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Quarters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                <SelectItem value="1">Q1</SelectItem>
                <SelectItem value="2">Q2</SelectItem>
                <SelectItem value="3">Q3</SelectItem>
                <SelectItem value="4">Q4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
