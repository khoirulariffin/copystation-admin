import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search, ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Product, Article } from "@/types";
import { InstagramEmbed } from "react-social-media-embed";

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from supabase
  const { data: products = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("views", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      // Map the database fields to match our Product type
      return data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
        views: product.views,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      })) as Product[];
    },
  });

  // Fetch articles from supabase
  const { data: articles = [] } = useQuery({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(
          `
          *,
          profiles:author_id (
            id,
            email,
            avatar
          )
        `
        )
        .order("views", { ascending: false })
        .limit(2);

      if (error) {
        console.error("Error fetching articles:", error);
        return [];
      }

      return data.map((article: any) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        author: {
          id: article.profiles.id,
          name: article.profiles.email, // Use email as name
          avatar: article.profiles.avatar,
        },
        views: article.views,
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        image: article.image,
      }));
    },
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <svg
            className="absolute top-[-200px] left-[-200px] h-[800px] w-[800px] text-blue-600 opacity-20 transform rotate-12"
            viewBox="0 0 800 800"
          >
            <circle
              cx="400"
              cy="400"
              r="200"
              strokeWidth="40"
              stroke="currentColor"
              fill="none"
            />
          </svg>
          <svg
            className="absolute bottom-[-300px] right-[-300px] h-[1000px] w-[1000px] text-blue-600 opacity-20 transform -rotate-12 animate-float"
            viewBox="0 0 800 800"
          >
            <circle
              cx="400"
              cy="400"
              r="300"
              strokeWidth="60"
              stroke="currentColor"
              fill="none"
            />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Your One-Stop Shop for <br className="hidden md:block" />
            <span className="text-blue-300">
              Office Supplies & Photocopy Solutions
            </span>
          </h1>
          <p
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            From premium stationery to professional printing services, we
            provide everything your business needs to thrive.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg"
            >
              <Link to="/products">Explore Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <a
            href="#features"
            className="flex flex-col items-center text-white text-sm"
          >
            <span className="mb-2 opacity-80">Discover More</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CopyStation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide professional services with premium quality products and
              unmatched customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Products",
                description:
                  "We stock only the highest quality office supplies from trusted brands.",
                icon: "🏆",
              },
              {
                title: "Professional Printing",
                description:
                  "State-of-the-art printing services for all your business needs.",
                icon: "🖨️",
              },
              {
                title: "Fast Delivery",
                description:
                  "Quick delivery to your doorstep, ensuring you never run out of supplies.",
                icon: "🚚",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-card border-none shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Discover our most popular office supplies and printing
                solutions.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/products" className="flex items-center">
                View All Products <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover-card border-none shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.stock <= 10 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      Low Stock: {product.stock} left
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Rp {product.price.toLocaleString()}
                    </span>
                    <Button asChild size="sm">
                      <Link to={`/products/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Articles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Tips, tricks, and insights to help optimize your office
                operations.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/articles" className="flex items-center">
                View All Articles <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover-card border-none shadow-lg"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative">
                    <img
                      src={
                        article.image ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 md:w-3/5">
                    <div className="text-sm text-gray-500 mb-2">
                      {article.category}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.content
                        .replace(/<[^>]*>?/gm, "")
                        .substring(0, 150)}
                      ...
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {article.author.name}
                        </span>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          to={`/articles/${article.id}`}
                          className="flex items-center"
                        >
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Feed Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us on Social Media
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow us for the latest updates, tips, and behind-the-scenes
              content.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* YouTube Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                <a
                  href="https://www.youtube.com/@nabilaislahhana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Nabila Islahhana
                </a>
              </h3>
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/1vILafWfSMU?si=MjN_xb_GP_U-aqv8"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Vly0HtpSxyY?si=fUCbYfTWGYNB5yjx"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/_rgpmai7_LY?si=OuB0uBQ1C-0gPONz"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
              <div className="mt-4 flex justify-center">
                <Button asChild variant="outline" className="flex items-center">
                  <a
                    href="https://www.youtube.com/@nabilaislahhana"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Channel <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Instagram Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-pink-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <a
                  href="https://www.instagram.com/fotokopisabilillah/?hl=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  fotokopisabilillah
                </a>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <InstagramEmbed
                  url="https://www.instagram.com/p/DGF9ItyPtDd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  width={"100%"}
                />
                <InstagramEmbed
                  url="https://www.instagram.com/p/DF7BXqQxJQz/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  width={"100%"}
                />
                <InstagramEmbed
                  url="https://www.instagram.com/p/DF7BVF0RkPk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                  width={"100%"}
                />
                {/* {[
                  {
                    id: 1,
                    image:
                      "https://www.instagram.com/p/Cg58dd7Lc-b/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
                    link: "https://www.instagram.com/p/Cg58dd7Lc-b/?utm_source=ig_embed&amp;utm_campaign=loading",
                  },
                  {
                    id: 2,
                    image:
                      "https://placehold.co/600x600/pink/white?text=Instagram+Post",
                    link: "https://www.instagram.com/fotokopisabilillah/",
                  },
                  {
                    id: 3,
                    image:
                      "https://placehold.co/600x600/pink/white?text=Instagram+Post",
                    link: "https://www.instagram.com/fotokopisabilillah/",
                  },
                  {
                    id: 4,
                    image:
                      "https://placehold.co/600x600/pink/white?text=Instagram+Post",
                    link: "https://www.instagram.com/fotokopisabilillah/",
                  },
                  {
                    id: 5,
                    image:
                      "https://placehold.co/600x600/pink/white?text=Instagram+Post",
                    link: "https://www.instagram.com/fotokopisabilillah/",
                  },
                  {
                    id: 6,
                    image:
                      "https://placehold.co/600x600/pink/white?text=Instagram+Post",
                    link: "https://www.instagram.com/fotokopisabilillah/",
                  },
                ].map((post) => (
                  <a
                    key={post.id}
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={post.image}
                      alt={`Instagram post ${post.id}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))} */}
              </div>
              <div className="mt-4 flex justify-center">
                <Button asChild variant="outline" className="flex items-center">
                  <a
                    href="https://www.instagram.com/fotokopisabilillah/?hl=id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Follow Us <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Office?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Browse our extensive collection of premium office supplies and
            professional services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-white text-blue-700 hover:bg-white/90"
            >
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-white/10"
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;
