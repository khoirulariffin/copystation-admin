
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      console.log("Fetching product details for ID:", productId);

      // Update view count - fix the type issue by using a separate update call
      if (productId) {
        // First, get the current view count
        const { data: currentProduct } = await supabase
          .from("products")
          .select("views")
          .eq("id", productId)
          .single();

        // Then update with incremented value
        if (currentProduct) {
          await supabase
            .from("products")
            .update({ views: (currentProduct.views || 0) + 1 })
            .eq("id", productId);
        }
      }

      // Get product details
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        toast.error("Could not load product details");
        throw error;
      }

      console.log("Received product data:", data);

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image: data.image,
        views: data.views,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Product;
    },
    enabled: !!productId,
  });

  // Function to open WhatsApp with pre-filled message
  const openWhatsApp = () => {
    if (!product) return;
    
    const phoneNumber = "6281281891205"; // WhatsApp number format (remove + and spaces)
    const message = encodeURIComponent(`Hai, saya ingin memesan ${product.name} melalui website. bisa tolong dibantu?`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp chat");
  };

  // Related products query (same category)
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      if (!product?.category) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
        .neq("id", productId)
        .limit(3);

      if (error) {
        console.error("Error fetching related products:", error);
        return [];
      }

      return data.map(
        (item) =>
          ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            stock: item.stock,
            image: item.image,
            views: item.views,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          } as Product)
      );
    },
    enabled: !!product?.category,
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the product you're looking for.
            </p>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 pt-24 pb-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-white mb-4">
            <Link to="/products" className="flex items-center hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
            <span className="mx-2">/</span>
            <span>{product.category}</span>
            <span className="mx-2">/</span>
            <span className="font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            <div>
              <div className="mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-blue-600 mb-6">
                Rp {product.price.toLocaleString()}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Availability</h3>
                {product.stock > 10 ? (
                  <p className="text-green-600 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    In Stock ({product.stock} available)
                  </p>
                ) : product.stock > 0 ? (
                  <p className="text-amber-600 flex items-center">
                    <span className="inline-block w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                    Low Stock (Only {product.stock} left)
                  </p>
                ) : (
                  <p className="text-red-600 flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                    Out of Stock
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-24">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 py-2"
                  onClick={openWhatsApp}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8" />
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {relatedProduct.stock <= 10 && relatedProduct.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Low Stock: {relatedProduct.stock} left
                      </div>
                    )}
                    {relatedProduct.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-1">
                      {relatedProduct.category}
                    </p>
                    <h3 className="font-semibold text-lg mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        Rp {relatedProduct.price.toLocaleString()}
                      </span>
                      <Button size="sm" asChild>
                        <Link to={`/products/${relatedProduct.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default ProductDetailPage;
