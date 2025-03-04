
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import SeedDataButton from '@/components/admin/SeedDataButton';

const Dashboard = () => {
  // Fetch dashboard statistics from Supabase
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get products count and stats
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, stock, views');
      
      if (productsError) throw productsError;
      
      // Get articles count and stats
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, views');
      
      if (articlesError) throw articlesError;
      
      // Get profiles count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });
      
      if (usersError) throw usersError;
      
      // Calculate dashboard stats
      const totalProducts = products?.length || 0;
      const availableProducts = products?.filter(p => p.stock > 0).length || 0;
      const outOfStockProducts = totalProducts - availableProducts;
      
      const productViews = {
        current: products?.reduce((sum, p) => sum + p.views, 0) || 0,
        previous: 0, // We don't have historical data yet
        percentChange: 0,
      };
      
      const totalArticles = articles?.length || 0;
      
      const articleViews = {
        current: articles?.reduce((sum, a) => sum + a.views, 0) || 0,
        previous: 0, // We don't have historical data yet
        percentChange: 0,
      };
      
      const userActivity = {
        total: usersCount || 0,
        active: usersCount || 0, // All users are considered active for now
        percentChange: 0,
      };
      
      return {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        productViews,
        totalArticles,
        articleViews,
        userActivity
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <AdminLayout title="Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <SeedDataButton />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-40">
              <CardHeader className="h-full bg-gray-100 rounded-md" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Products</CardTitle>
              <CardDescription>Total products in inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalProducts || 0}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {stats?.availableProducts || 0} available, {stats?.outOfStockProducts || 0} out of stock
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Product Views</CardTitle>
              <CardDescription>Total product page visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.productViews.current || 0}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {/* Since we don't have historical data yet */}
              Just started tracking
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Articles</CardTitle>
              <CardDescription>Total published articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalArticles || 0}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {stats?.articleViews.current || 0} total views
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Article Views</CardTitle>
              <CardDescription>Total article page visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.articleViews.current || 0}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {/* Since we don't have historical data yet */}
              Just started tracking
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Activity</CardTitle>
              <CardDescription>Total registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.userActivity.total || 0}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {stats?.userActivity.active || 0} active users
            </CardFooter>
          </Card>

          <Card className="bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Tips</CardTitle>
              <CardDescription>Getting started</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Create test users on the Login page</p>
              <p>• Use "Create Sample Data" to add demo content</p>
              <p>• View and manage data in the admin tables</p>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
