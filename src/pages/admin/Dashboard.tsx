
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ShoppingBag, 
  FileText,
  Users,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDashboardStats, mockProducts } from '@/data/mockData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const stats = mockDashboardStats;

  // Mock time-series data
  const productViewsData = [
    { name: 'Jan', current: 1200, previous: 900 },
    { name: 'Feb', current: 1400, previous: 1000 },
    { name: 'Mar', current: 1300, previous: 1100 },
    { name: 'Apr', current: 1500, previous: 1200 },
    { name: 'May', current: 1700, previous: 1300 },
    { name: 'Jun', current: 1832, previous: 1547 }
  ];

  const articleViewsData = [
    { name: 'Jan', views: 500 },
    { name: 'Feb', views: 600 },
    { name: 'Mar', views: 700 },
    { name: 'Apr', views: 800 },
    { name: 'May', views: 950 },
    { name: 'Jun', views: 1123 }
  ];

  const categoryData = [
    { name: 'Paper', value: 35 },
    { name: 'Stationery', value: 25 },
    { name: 'Office Supplies', value: 20 },
    { name: 'Printing Services', value: 15 },
    { name: 'Electronics', value: 5 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Time range selector */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
              <div className="flex items-center pt-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500">
                    {stats.availableProducts} available, {stats.outOfStockProducts} out of stock
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Product Views</CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.productViews.current}</div>
              <div className="flex items-center pt-1">
                {stats.productViews.percentChange > 0 ? (
                  <ArrowUpCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stats.productViews.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.productViews.percentChange)}%
                </span>
                <span className="text-sm font-medium text-gray-500 ml-1">
                  vs. last {timeRange}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Article Views</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.articleViews.current}</div>
              <div className="flex items-center pt-1">
                {stats.articleViews.percentChange > 0 ? (
                  <ArrowUpCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stats.articleViews.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.articleViews.percentChange)}%
                </span>
                <span className="text-sm font-medium text-gray-500 ml-1">
                  vs. last {timeRange}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">User Activity</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.userActivity.total}</div>
              <div className="flex items-center pt-1">
                {stats.userActivity.percentChange > 0 ? (
                  <ArrowUpCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stats.userActivity.percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.userActivity.percentChange)}%
                </span>
                <span className="text-sm font-medium text-gray-500 ml-1">
                  vs. last {timeRange}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover-card">
            <CardHeader>
              <CardTitle>Product Views Trend</CardTitle>
              <CardDescription>Comparison with previous period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={productViewsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="current"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Current Period"
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Previous Period"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader>
              <CardTitle>Article Views</CardTitle>
              <CardDescription>Monthly article engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={articleViewsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 hover-card">
            <CardHeader>
              <CardTitle>Product Stock Overview</CardTitle>
              <CardDescription>Current inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                  <TabsTrigger value="out">Out of Stock</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="max-h-[300px] overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium text-gray-500">Product</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-500">Category</th>
                          <th className="text-right py-2 px-4 font-medium text-gray-500">Stock</th>
                          <th className="text-right py-2 px-4 font-medium text-gray-500">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4 text-gray-500">{product.category}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.stock === 0 
                                  ? 'bg-red-100 text-red-800' 
                                  : product.stock <= 10 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-green-100 text-green-800'
                              }`}>
                                {product.stock === 0 ? 'Out of Stock' : product.stock}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">Rp {product.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="low">
                  <div className="max-h-[300px] overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium text-gray-500">Product</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-500">Category</th>
                          <th className="text-right py-2 px-4 font-medium text-gray-500">Stock</th>
                          <th className="text-right py-2 px-4 font-medium text-gray-500">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProducts.filter(p => p.stock > 0 && p.stock <= 10).map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4 text-gray-500">{product.category}</td>
                            <td className="py-3 px-4 text-right">
                              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                                {product.stock}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">Rp {product.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="out">
                  <div className="max-h-[300px] overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium text-gray-500">Product</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-500">Category</th>
                          <th className="text-right py-2 px-4 font-medium text-gray-500">Stock</th>
                          <th className="text-right py-2 px-4 font-medium text-gray-500">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockProducts.filter(p => p.stock === 0).map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4 text-gray-500">{product.category}</td>
                            <td className="py-3 px-4 text-right">
                              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">Rp {product.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="hover-card">
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
