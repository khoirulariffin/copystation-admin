
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { toast } from "sonner";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types";
import { format } from "date-fns";

const ArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  
  // Fetch article details
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      console.log("Fetching article details for ID:", articleId);
      
      // Update view count - fix the type issue by using a separate update call
      if (articleId) {
        // First, get the current view count
        const { data: currentArticle } = await supabase
          .from("articles")
          .select("views")
          .eq("id", articleId)
          .single();
        
        // Then update with incremented value using the function that returns 1
        if (currentArticle) {
          await supabase
            .from("articles")
            .update({ views: (currentArticle.views || 0) + 1 })
            .eq("id", articleId);
        }
      }
      
      // Get article details with author profile
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
        .eq("id", articleId)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        toast.error("Could not load article details");
        throw error;
      }

      console.log("Received article data:", data);
      
      const profileData = data.profiles || null;
      
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        author: {
          id: profileData?.id || data.author_id,
          name: profileData?.email || "Unknown Author",
          avatar: profileData?.avatar || "https://ui-avatars.com/api/?name=Unknown&background=random&color=fff",
        },
        views: data.views,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        image: data.image || "https://placehold.co/600x400?text=No+Image",
      } as Article;
    },
    enabled: !!articleId,
  });

  // Related articles query (same category)
  const { data: relatedArticles = [] } = useQuery({
    queryKey: ["related-articles", article?.category],
    queryFn: async () => {
      if (!article?.category) return [];
      
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
        .eq("category", article.category)
        .neq("id", articleId)
        .limit(3);

      if (error) {
        console.error("Error fetching related articles:", error);
        return [];
      }

      return data.map((item) => {
        const profileData = item.profiles || null;
        
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          category: item.category,
          author: {
            id: profileData?.id || item.author_id,
            name: profileData?.email || "Unknown Author",
            avatar: profileData?.avatar || "https://ui-avatars.com/api/?name=Unknown&background=random&color=fff",
          },
          views: item.views,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          image: item.image || "https://placehold.co/600x400?text=No+Image",
        } as Article;
      });
    },
    enabled: !!article?.category,
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

  if (!article) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the article you're looking for.
            </p>
            <Button asChild>
              <Link to="/articles">Back to Articles</Link>
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-white mb-4">
            <Link to="/articles" className="flex items-center hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Articles
            </Link>
            <span className="mx-2">/</span>
            <span>{article.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{article.title}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <div className="mb-8 flex flex-wrap items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{article.views} views</span>
          </div>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {article.category}
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Article Content */}
        <div className="prose prose-blue lg:prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        
        <Separator className="my-12" />
        
        {/* Author Info */}
        <div className="flex items-center mb-12 p-6 bg-gray-50 rounded-lg">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="h-16 w-16 rounded-full mr-6"
          />
          <div>
            <h3 className="text-lg font-medium mb-1">Written by {article.author.name}</h3>
            <p className="text-gray-600">
              Contributor at Fotokopi Sabilillah
            </p>
          </div>
        </div>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover min-h-48"
                      />
                    </div>
                    <CardContent className="p-6 md:w-3/5">
                      <div className="text-sm text-gray-500 mb-2">
                        {relatedArticle.category}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {relatedArticle.content.replace(/<[^>]*>?/gm, "").substring(0, 120)}...
                      </p>
                      <div className="mt-auto flex items-center justify-end">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/articles/${relatedArticle.id}`} className="flex items-center">
                            Read More <ArrowLeft className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
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

export default ArticleDetailPage;
