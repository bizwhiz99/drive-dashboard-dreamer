
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CityComparisonCard from "@/components/CityComparisonCard";
import OwnershipRateChart from "@/components/charts/OwnershipRateChart";

interface ComparisonsTabProps {
  data: any[];
  allData: any[];
}

const ComparisonsTab: React.FC<ComparisonsTabProps> = ({ data, allData }) => {
  return (
    <div className="space-y-4">
      <CityComparisonCard data={allData} />
      
      <Card>
        <CardHeader>
          <CardTitle>Ownership vs Rental Rate by City</CardTitle>
          <CardDescription>Comparing ownership and rental rates between cities</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <OwnershipRateChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonsTab;
