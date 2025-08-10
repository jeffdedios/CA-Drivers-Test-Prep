import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Car, TrendingUp, Target, Award, AlertTriangle } from "lucide-react";
import { getCategoryName } from "@/lib/questions";

const USER_ID = "demo-user";

type UserStats = {
  totalAnswered: number;
  totalCorrect: number;
  categoryStats: Array<{
    category: string;
    answered: number;
    correct: number;
    accuracy: number;
  }>;
};

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: [`/api/stats/${USER_ID}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Car className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-gray-600">Loading stats...</p>
          </div>
        </div>
      </div>
    );
  }

  const overallAccuracy = stats && stats.totalAnswered > 0 
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  const progressPercentage = stats && stats.totalAnswered > 0 
    ? Math.min((stats.totalAnswered / 50) * 100, 100) // Assuming 50 total questions
    : 0;

  const weakestCategory = stats?.categoryStats
    ?.filter(cat => cat.answered > 0)
    ?.sort((a, b) => a.accuracy - b.accuracy)[0];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-semibold">Your Progress</h1>
            <p className="text-blue-100 text-sm">Track your learning journey</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-20">
        {/* Overall Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions Answered</span>
                <span className="font-medium">{stats?.totalAnswered || 0}/50</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.totalCorrect || 0}
                </div>
                <div className="text-xs text-green-700">Correct</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {overallAccuracy}%
                </div>
                <div className="text-xs text-blue-700">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Performance by Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.categoryStats?.length > 0 ? (
              stats.categoryStats.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {getCategoryName(category.category)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.answered > 0 ? `${category.accuracy}%` : "Not started"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={category.accuracy} 
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-gray-500 w-12">
                      {category.correct}/{category.answered}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Start studying to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        {weakestCategory && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                Recommended Study
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Focus on "{getCategoryName(weakestCategory.category)}"
                </p>
                <p className="text-sm text-yellow-700">
                  You're getting {weakestCategory.accuracy}% correct in this category. 
                  Practice more questions to improve your score.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Study Streak */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Study Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-800">
                  {Math.ceil((stats?.totalAnswered || 0) / 10)}
                </div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">
                  {stats?.totalAnswered || 0}
                </div>
                <div className="text-xs text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">
                  {overallAccuracy}%
                </div>
                <div className="text-xs text-gray-600">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
