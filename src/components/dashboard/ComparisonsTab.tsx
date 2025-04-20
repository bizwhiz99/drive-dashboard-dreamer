
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CityComparisonCard from "@/components/CityComparisonCard";
import RentalRateChart from "@/components/charts/RentalRateChart";
import OwnershipRateChart from "@/components/charts/OwnershipRateChart";

interface ComparisonsTabProps {
  data: any[];
  allData: any[];
}

const ComparisonsTab: React.FC<ComparisonsTabProps> = ({ data, allData }) => {
  return (
    <div className="space-y-4">
      <CityComparisonCard data={allData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ownership Rate Over Time</CardTitle>
            <CardDescription>Comparing ownership rates between cities</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <OwnershipRateChart data={data} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rental Rate Over Time</CardTitle>
            <CardDescription>Comparing rental rates between cities</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <RentalRateChart data={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonsTab;
