
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseIcon } from 'lucide-react';

const SeedDataButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSeedData = async () => {
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function to seed data
      const { data, error } = await supabase.functions.invoke('seed-data');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success('Sample data created successfully!');
      } else {
        throw new Error(data.message || 'Failed to create sample data');
      }
    } catch (error: any) {
      console.error('Error seeding data:', error);
      toast.error(`Failed to seed data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedData} 
      variant="outline" 
      className="ml-4 flex items-center gap-2"
      disabled={isLoading}
    >
      <DatabaseIcon className="h-4 w-4" />
      {isLoading ? 'Creating Data...' : 'Create Sample Data'}
    </Button>
  );
};

export default SeedDataButton;
