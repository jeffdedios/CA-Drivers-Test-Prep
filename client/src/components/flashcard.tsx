import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Question } from "@shared/schema";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isBookmarked: boolean;
  onSelectAnswer: (index: number) => void;
  onToggleBookmark: () => void;
  showFeedback: boolean;
}

export function Flashcard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isBookmarked,
  onSelectAnswer,
  onToggleBookmark,
  showFeedback,
}: FlashcardProps) {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <Card className="bg-white rounded-xl shadow-md border p-6 min-h-96 relative">
      {/* Question Number & Bookmark */}
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Question {currentIndex + 1}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBookmark}
          className="text-gray-400 hover:text-warning transition-colors p-1"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-warning" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-lg font-medium text-gray-800 leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const isIncorrect = showFeedback && isSelected && !isCorrect;
          const shouldHighlightCorrect = showFeedback && isCorrect;

          return (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-200 group h-auto min-h-[60px]",
                isSelected && !showFeedback && "border-primary bg-blue-50",
                shouldHighlightCorrect && "border-green-500 bg-green-50",
                isIncorrect && "border-red-500 bg-red-50"
              )}
              onClick={() => onSelectAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <div className="flex items-center w-full">
                <span
                  className={cn(
                    "w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 shrink-0",
                    isSelected && !showFeedback && "bg-primary text-white",
                    shouldHighlightCorrect && "bg-green-500 text-white",
                    isIncorrect && "bg-red-500 text-white"
                  )}
                >
                  {optionLabels[index]}
                </span>
                <span className={cn(
                  "text-gray-700 text-left",
                  shouldHighlightCorrect && "text-green-800 font-medium",
                  isIncorrect && "text-red-800"
                )}>
                  {option}
                </span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Swipe Hint */}
      <div className="text-center text-gray-400 text-sm">
        <i className="fas fa-hand-pointer mr-1"></i>
        Tap an answer or swipe to navigate
      </div>
    </Card>
  );
}
