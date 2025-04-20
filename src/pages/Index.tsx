
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Airbnb Impact on Housing Markets Dashboard</h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        Explore the relationship between Airbnb activity and housing market indicators in San Francisco and Austin from 2010 to 2023.
      </p>
      <div className="space-y-6 w-full max-w-lg">
        <div className="bg-primary/10 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
          <ul className="text-left space-y-2 mb-6">
            <li>• Compare housing price trends in elastic vs inelastic markets</li>
            <li>• Analyze the correlation between Airbnb growth and housing affordability</li>
            <li>• Examine shifts in housing composition (owned vs. rental units)</li>
            <li>• Explore the relationship between short-term rentals and local housing markets</li>
          </ul>
          <Link to="/dashboard">
            <Button className="w-full">
              View Dashboard
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
