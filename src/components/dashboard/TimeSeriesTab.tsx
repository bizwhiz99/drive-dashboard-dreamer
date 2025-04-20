
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirbnbActivityChart from "@/components/charts/AirbnbActivityChart";
import HpiChart from "@/components/charts/HpiChart";
import MedianRentChart from "@/components/charts/MedianRentChart";
import MedianIncomeChart from "@/components/charts/MedianIncomeChart";
import HousingUnitsChart from "@/components/charts/HousingUnitsChart";
import OwnershipRateChart from "@/components/charts/OwnershipRateChart";

interface TimeSeriesTabProps {
  data: any[];
}

const TimeSeriesTab: React.FC<TimeSeriesTabProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Airbnb Activity Over Time</CardTitle>
            <CardDescription>Number of Airbnb listings by city over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <AirbnbActivityChart data={data} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Housing Price Index Over Time</CardTitle>
            <CardDescription>Housing price index trends by city</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <HpiChart data={data} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Median Rent Over Time</CardTitle>
            <CardDescription>Monthly median rent trends by city</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <MedianRentChart data={data} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Median Income Over Time</CardTitle>
            <CardDescription>Annual median household income by city</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <MedianIncomeChart data={data} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Housing Units Over Time</CardTitle>
          <CardDescription>Owned vs rental units by city (in thousands)</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <HousingUnitsChart data={data} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ownership vs Rental Rate by City</CardTitle>
          <CardDescription>Most recent ownership and rental rates</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <OwnershipRateChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSeriesTab;
