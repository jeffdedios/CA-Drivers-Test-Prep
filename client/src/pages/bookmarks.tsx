import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Bookmark, Car } from "lucide-react";
import { getCategoryName } from "@/lib/questions";
import { Link } from "wouter";

import { Question } from "@shared/schema";

const USER_ID = "demo-user";

export default function BookmarksPage() {
  const { data: bookmarkedQuestions = [], isLoading } = useQuery<Question[]>({
    queryKey: [`/api/bookmarks/${USER_ID}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Car className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-gray-600">Loading bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Bookmark className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-semibold">Bookmarked Questions</h1>
            <p className="text-blue-100 text-sm">
              {bookmarkedQuestions.length} saved for review
            </p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-20">
        {bookmarkedQuestions.length > 0 ? (
          <div className="space-y-3">
            {bookmarkedQuestions.map((question, index: number) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full font-medium">
                      Question {index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getCategoryName(question.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    {question.questionText}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {question.difficulty || 'medium'} difficulty
                    </span>
                    <Link href="/">
                      <Button size="sm" variant="outline" className="text-xs">
                        Study Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Bookmarks Yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 px-4">
              Bookmark questions you want to review later by tapping the bookmark icon during study sessions.
            </p>
            <Link href="/">
              <Button className="bg-primary text-white hover:bg-blue-700">
                Start Studying
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
