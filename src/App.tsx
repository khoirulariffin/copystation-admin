
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import ArticleManagement from "./pages/admin/ArticleManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("User authenticated, rendering protected route");
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/admin" replace /> : <LandingPage />
      } />
      
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/admin" replace /> : <Login />
      } />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute>
          <ProductManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/articles" element={
        <ProtectedRoute>
          <ArticleManagement />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
