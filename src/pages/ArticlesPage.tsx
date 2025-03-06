import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types";
import { articleCategories } from "@/data/mockData";

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch articles from supabase
  const { data: articles = [] } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      console.log("Fetching articles...");
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            id,
            email,
            avatar
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        return [];
      }

      console.log("Received data from Supabase:", data);

      // Map the database fields to match our Article type
      const mappedArticles = data.map((article: any) => {
        // Check if profiles data exists
        const profileData = article.profiles || null;
        
        return {
          id: article.id,
          title: article.title,
          content: article.content,
          category: article.category,
          author: {
            id: profileData?.id || article.author_id,
            name: profileData?.email || 'Unknown Author',
            avatar: profileData?.avatar || 'https://ui-avatars.com/api/?name=Unknown&background=random&color=fff',
          },
          views: article.views,
          createdAt: article.created_at,
          updatedAt: article.updated_at,
          image: article.image || '',
        };
      });

      console.log("Filtered articles:", mappedArticles);
      return mappedArticles;
    },
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearchTerm =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <PublicLayout>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center w-full md:w-auto">
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-full md:w-64 rounded-full py-3 px-6 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 md:right-6 text-gray-500" />
            </div>

            <div className="mt-4 md:mt-0">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-[180px] md:w-[200px] rounded-full py-3 px-4 border-gray-300 bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {articleCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="bg-white rounded-lg shadow-md">
                <div className="relative">
                  <img
                    src={
                      article.image ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}
                    ...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {article.author.name}
                      </span>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/articles/${article.id}`} className="flex items-center">
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ArticlesPage;
