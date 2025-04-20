
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Filter, ArrowDown } from "lucide-react";

import CsvDataProvider from "@/components/CsvDataProvider";
import AirbnbActivityChart from "@/components/charts/AirbnbActivityChart";
import HousingPriceIndexChart from "@/components/charts/HousingPriceIndexChart";
import HousingUnitsChart from "@/components/charts/HousingUnitsChart";
import ScatterPlot from "@/components/charts/ScatterPlot";
import OwnershipRateChart from "@/components/charts/OwnershipRateChart";
import CityComparisonCard from "@/components/CityComparisonCard";
import LoadingIndicator from "@/components/LoadingIndicator";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [csvUrl, setCsvUrl] = useState<string>('https://docs.google.com/spreadsheets/d/1ewPYAHgZJc6jV_i8D1634_klao-D78UqK59AlNVylKk/edit?usp=sharing');
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const availableYears = React.useMemo(() => {
    if (!csvData.length) return [];
    const years = Array.from(new Set(csvData.map(item => item.year)));
    return years.sort((a, b) => a - b);
  }, [csvData]);

  const availableCities = React.useMemo(() => {
    if (!csvData.length) return [];
    return Array.from(new Set(csvData.map(item => item.city)));
  }, [csvData]);

  const applyFilters = React.useCallback(() => {
    let filtered = [...csvData];
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity);
    }
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === parseInt(selectedYear));
    }
    
    if (selectedQuarter !== 'all') {
      filtered = filtered.filter(item => item.quarter === parseInt(selectedQuarter));
    }
    
    setFilteredData(filtered);
  }, [csvData, selectedCity, selectedYear, selectedQuarter]);

  useEffect(() => {
    if (csvData.length) {
      applyFilters();
    }
  }, [csvData, selectedCity, selectedYear, selectedQuarter, applyFilters]);

  const handleDataLoaded = (data: any[]) => {
    // Process the data to ensure proper types for numerical values
    const processedData = data.map(item => ({
      ...item,
      year: parseInt(item.year),
      quarter: parseInt(item.quarter),
      airbnb_activity: parseFloat(item.airbnb_activity),
      airbnb_ratio: parseFloat(item.airbnb_ratio),
      hpi: parseFloat(item.hpi),
      median_rent: parseFloat(item.median_rent),
      owned_units: parseFloat(item.owned_units),
      rental_units: parseFloat(item.rental_units),
      ownership_rate: parseFloat(item.ownership_rate),
      rental_rate: parseFloat(item.rental_rate),
      unemployment: parseFloat(item.unemployment),
      median_income: parseFloat(item.median_income),
    }));
    
    setCsvData(processedData);
    setFilteredData(processedData);
    setIsLoading(false);
    toast({
      title: "Data loaded successfully",
      description: `Loaded ${processedData.length} records from the CSV file.`,
      duration: 3000,
    });
  };

  const handleError = (error: Error) => {
    setIsLoading(false);
    toast({
      title: "Error loading data",
      description: error.message,
      duration: 5000,
      variant: "destructive",
    });
  };

  const handleUrlSubmit = () => {
    setIsLoading(true);
    setIsUrlLoading(true);
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedYear('all');
    setSelectedQuarter('all');
    toast({
      title: "Filters reset",
      description: "Displaying all available data.",
      duration: 2000,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Airbnb Impact on Housing Markets Dashboard</h1>
        <p className="text-muted-foreground">
          Analyzing how Airbnb activity correlates with housing indicators in Austin and San Francisco (2010-2023)
        </p>
      </div>

      <CsvDataProvider 
        url={csvUrl} 
        onDataLoaded={handleDataLoaded} 
        onError={handleError}
        isUrlLoading={isUrlLoading}
        setIsUrlLoading={setIsUrlLoading}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
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
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
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
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
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
                  <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
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

          <Tabs defaultValue="key-metrics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="key-metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="comparisons">City Comparisons</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>

            <TabsContent value="key-metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Airbnb Activity Over Time</CardTitle>
                    <CardDescription>Trend of Airbnb activity by city</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <AirbnbActivityChart data={filteredData} />
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Housing Price Index Over Time</CardTitle>
                    <CardDescription>Trend of Housing Price Index (HPI) by city</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <HousingPriceIndexChart data={filteredData} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Housing Units Composition Over Time</CardTitle>
                  <CardDescription>Distribution of owned units vs rental units</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <HousingUnitsChart data={filteredData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparisons" className="space-y-4">
              <CityComparisonCard data={csvData} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Ownership vs Rental Rate by City</CardTitle>
                  <CardDescription>Comparing ownership and rental rates between cities</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <OwnershipRateChart data={filteredData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Airbnb Ratio vs Housing Price Index</CardTitle>
                  <CardDescription>Relationship between Airbnb's share of housing and price indices</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ScatterPlot data={filteredData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
