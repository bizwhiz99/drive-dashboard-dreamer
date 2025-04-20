
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AirbnbActivityChart from "@/components/charts/AirbnbActivityChart";
import HousingPriceIndexChart from "@/components/charts/HousingPriceIndexChart";
import HousingUnitsChart from "@/components/charts/HousingUnitsChart";

interface KeyMetricsTabProps {
  data: any[];
}

const KeyMetricsTab: React.FC<KeyMetricsTabProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Airbnb Activity Over Time</CardTitle>
            <CardDescription>Trend of Airbnb activity by city</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <AirbnbActivityChart data={data} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Housing Price Index Over Time</CardTitle>
            <CardDescription>Trend of Housing Price Index (HPI) by city</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <HousingPriceIndexChart data={data} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Housing Units Composition Over Time</CardTitle>
          <CardDescription>Distribution of owned units vs rental units</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <HousingUnitsChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetricsTab;
