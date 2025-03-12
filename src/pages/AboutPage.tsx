
import React from "react";
import { Info, Users, Award, Clock } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Separator } from "@/components/ui/separator";

const AboutPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fotokopi Sabilillah provides quality printing services and 
            stationery supplies for all your educational and office needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="glass-panel rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Established in 2010, Fotokopi Sabilillah started as a small family business 
              with a simple goal: to serve the local community with reliable printing services 
              and quality stationery supplies.
            </p>
            <p className="text-gray-600">
              Over the years, we've grown to become a trusted name in Medan Satria, Bekasi, 
              providing comprehensive solutions for students, professionals, and businesses alike.
            </p>
          </div>
          
          <div className="glass-panel rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Our mission is to provide high-quality printing services and stationery products 
              at affordable prices, with excellent customer service that exceeds expectations.
            </p>
            <p className="text-gray-600">
              We strive to be environmentally responsible in our operations while meeting 
              the diverse needs of our community with integrity and dedication.
            </p>
          </div>
        </div>

        <Separator className="my-16" />

        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-6 hover-card rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
            <p className="text-gray-600">
              We pride ourselves on delivering exceptional quality in everything we do, 
              from printing to product selection.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 hover-card rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Focused</h3>
            <p className="text-gray-600">
              Our customers are our priority. We listen to your needs and strive to exceed 
              your expectations every time.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 hover-card rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            <p className="text-gray-600">
              With over a decade of experience, we have the expertise to handle all your 
              stationery and printing needs.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4">Our Service Commitment</h2>
              <p className="text-gray-600 mb-4">
                At Fotokopi Sabilillah, we are committed to providing:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Fast and reliable printing services</li>
                <li>High-quality stationery products</li>
                <li>Competitive and transparent pricing</li>
                <li>Friendly and helpful customer service</li>
                <li>Environmentally responsible practices</li>
              </ul>
            </div>
            
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
