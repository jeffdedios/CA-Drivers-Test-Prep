import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Question } from "@shared/schema";

interface AnswerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  selectedAnswer: number | null;
  isCorrect: boolean;
}

export function AnswerFeedbackModal({
  isOpen,
  onClose,
  question,
  selectedAnswer,
  isCorrect,
}: AnswerFeedbackModalProps) {
  if (!question || selectedAnswer === null) return null;

  const optionLabels = ["A", "B", "C", "D"];
  const correctAnswerText = question.options[question.correctAnswer];
  const selectedAnswerText = question.options[selectedAnswer];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full p-6">
        <div className="text-center">
          {isCorrect ? (
            <div>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white h-8 w-8" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-800 mb-2">
                Correct!
              </DialogTitle>
              <p className="text-gray-600 text-sm mb-4">
                Great job! You selected the right answer.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-white h-8 w-8" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-800 mb-2">
                Not Quite
              </DialogTitle>
              <p className="text-gray-600 text-sm mb-4">
                The correct answer is {optionLabels[question.correctAnswer]}: {correctAnswerText}
              </p>
            </div>
          )}
          
          {/* Explanation */}
          <div className={`${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-3 mb-4`}>
            <p className={`${isCorrect ? 'text-green-800' : 'text-red-800'} text-sm font-medium`}>
              Explanation:
            </p>
            <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'} text-sm mt-1`}>
              {question.explanation}
            </p>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
