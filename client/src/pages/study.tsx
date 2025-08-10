import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Car, Settings, ChevronLeft, ChevronRight, Flag, Lightbulb } from "lucide-react";
import { Flashcard } from "@/components/flashcard";
import { AnswerFeedbackModal } from "@/components/answer-feedback-modal";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useStudySession } from "@/hooks/use-study-session";
import { CATEGORIES, STUDY_MODES, getCategoryName } from "@/lib/questions";
import { cn } from "@/lib/utils";

export default function StudyPage() {
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    showFeedback,
    studyMode,
    category,
    questionsAnswered,
    correctAnswers,
    progressPercentage,
    isLoading,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    setStudyMode,
    setCategory,
    toggleBookmark,
    closeFeedback,
    isCurrentQuestionBookmarked,
    hasNext,
    hasPrevious,
    isAnswered,
  } = useStudySession();

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasNext) {
      nextQuestion();
    }
    if (isRightSwipe && hasPrevious) {
      previousQuestion();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Car className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-gray-600">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600">No questions available for this category.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative overflow-hidden">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-semibold">CA Driver's Test Prep</h1>
              <p className="text-blue-100 text-sm">
                Progress: {questionsAnswered}/{questions.length} questions
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2 rounded-full hover:bg-blue-600 transition-colors text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-blue-100 mb-1">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>of {questions.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-blue-600" />
        </div>
      </header>

      {/* Study Mode Selector */}
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Study Mode</h2>
        <div className="flex space-x-2">
          {STUDY_MODES.map((mode) => (
            <Button
              key={mode.id}
              onClick={() => setStudyMode(mode.id)}
              variant={studyMode === mode.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-1 text-sm font-medium transition-colors",
                studyMode === mode.id 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              )}
            >
              <i className={`${mode.icon} mr-2`}></i>
              {mode.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b bg-white">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              variant={category === cat.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-xs font-medium rounded-full",
                category === cat.id 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Flashcard Container */}
      <div 
        className="flex-1 p-4 space-y-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentQuestion && (
          <Flashcard
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            isBookmarked={isCurrentQuestionBookmarked()}
            onSelectAnswer={selectAnswer}
            onToggleBookmark={toggleBookmark}
            showFeedback={showFeedback}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="ghost"
            onClick={previousQuestion}
            disabled={!hasPrevious}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={nextQuestion}
            disabled={!hasNext}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Answer Feedback Modal */}
      <AnswerFeedbackModal
        isOpen={showFeedback}
        onClose={closeFeedback}
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        isCorrect={selectedAnswer !== null && currentQuestion ? selectedAnswer === currentQuestion.correctAnswer : false}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
