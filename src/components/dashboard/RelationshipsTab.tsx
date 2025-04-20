
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirbnbRatioHpiScatterPlot from "@/components/charts/AirbnbRatioHpiScatterPlot";
import AirbnbRatioRentScatterPlot from "@/components/charts/AirbnbRatioRentScatterPlot";
import CorrelationHeatmap from "@/components/charts/CorrelationHeatmap";

interface RelationshipsTabProps {
  data: any[];
}

const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Correlation Heatmap</CardTitle>
          <CardDescription>Correlation strength between key housing market metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <CorrelationHeatmap data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RelationshipsTab;
