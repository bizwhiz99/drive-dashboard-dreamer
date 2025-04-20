
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirbnbActivityChart from "@/components/charts/AirbnbActivityChart";
import HpiChart from "@/components/charts/HpiChart";
import MedianRentChart from "@/components/charts/MedianRentChart";
import MedianIncomeChart from "@/components/charts/MedianIncomeChart";
import HousingUnitsChart from "@/components/charts/HousingUnitsChart";
import OwnershipRentalRatesChart from "@/components/charts/OwnershipRentalRatesChart";

interface TimeSeriesTabProps {
  data: any[];
}

const TimeSeriesTab: React.FC<TimeSeriesTabProps> = ({ data }) => {
  return (
    <div className="space-y-12">
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

      <Card className="mb-16 space-y-4">
        <CardHeader>
          <CardTitle>Housing Units Over Time</CardTitle>
          <CardDescription>Owned vs rental units by city (in thousands)</CardDescription>
        </CardHeader>
        <CardContent className="h-[650px] pb-20">
          <HousingUnitsChart data={data} />
        </CardContent>
      </Card>
      
      <Card className="mb-16 space-y-4">
        <CardHeader>
          <CardTitle>Ownership &amp; Rental Rates Over Time</CardTitle>
          <CardDescription>Ownership and rental rate trends by city</CardDescription>
        </CardHeader>
        <CardContent className="h-[600px] pb-16">
          <OwnershipRentalRatesChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
};
export default TimeSeriesTab;
