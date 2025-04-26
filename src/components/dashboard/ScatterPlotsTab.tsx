
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirbnbRatioHpiScatterPlot from "@/components/charts/AirbnbRatioHpiScatterPlot";
import AirbnbRatioRentScatterPlot from "@/components/charts/AirbnbRatioRentScatterPlot";

interface ScatterPlotsTabProps {
  data: any[];
}

const ScatterPlotsTab: React.FC<ScatterPlotsTabProps> = ({ data }) => {
  console.log("ScatterPlotsTab received data length:", data.length);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Airbnb Ratio vs Housing Price Index</CardTitle>
          <CardDescription>Relationship between Airbnb's share of housing and housing price indices</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <AirbnbRatioHpiScatterPlot data={data} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Airbnb Ratio vs Median Rent</CardTitle>
          <CardDescription>Relationship between Airbnb's share of housing and median rent costs</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <AirbnbRatioRentScatterPlot data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScatterPlotsTab;
