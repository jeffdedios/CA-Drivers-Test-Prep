import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Question } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { getQuestionOrder } from "@/lib/questions";

const USER_ID = "demo-user"; // In a real app, this would come from auth

interface StudySessionState {
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  studyMode: string;
  category: string;
  sessionId: string | null;
  questionsAnswered: number;
  correctAnswers: number;
}

export function useStudySession() {
  const queryClient = useQueryClient();
  const [sessionState, setSessionState] = useState<StudySessionState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    showFeedback: false,
    studyMode: "sequential",
    category: "all",
    sessionId: null,
    questionsAnswered: 0,
    correctAnswers: 0,
  });

  // Fetch questions based on current category
  const { data: allQuestions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions", sessionState.category],
    enabled: true,
  });

  // Get ordered questions based on study mode
  const questions = getQuestionOrder(allQuestions, sessionState.studyMode, USER_ID);
  const currentQuestion = questions[sessionState.currentQuestionIndex];

  // Fetch user progress
  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/progress", USER_ID],
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ["/api/stats", USER_ID],
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { questionId: string; isCorrect: boolean; timeDelta?: number }) => {
      const existingProgress = userProgress.find((p: any) => p.questionId === data.questionId);
      const timesAnswered = (existingProgress?.timesAnswered || 0) + 1;
      const timesCorrect = (existingProgress?.timesCorrect || 0) + (data.isCorrect ? 1 : 0);
      
      return apiRequest("POST", `/api/progress/${USER_ID}/${data.questionId}`, {
        timesAnswered,
        timesCorrect,
        lastAnswered: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats", USER_ID] });
    },
  });

  // Toggle bookmark mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: async (data: { questionId: string; isBookmarked: boolean }) => {
      return apiRequest("POST", `/api/bookmarks/${USER_ID}/${data.questionId}`, {
        isBookmarked: data.isBookmarked,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress", USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks", USER_ID] });
    },
  });

  // Select an answer
  const selectAnswer = (answerIndex: number) => {
    if (sessionState.selectedAnswer !== null || !currentQuestion) return;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setSessionState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
    }));

    // Update progress
    updateProgressMutation.mutate({
      questionId: currentQuestion.id,
      isCorrect,
    });
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (sessionState.currentQuestionIndex < questions.length - 1) {
      setSessionState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedAnswer: null,
        showFeedback: false,
      }));
    }
  };

  // Navigate to previous question
  const previousQuestion = () => {
    if (sessionState.currentQuestionIndex > 0) {
      setSessionState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        selectedAnswer: null,
        showFeedback: false,
      }));
    }
  };

  // Change study mode
  const setStudyMode = (mode: string) => {
    setSessionState(prev => ({
      ...prev,
      studyMode: mode,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showFeedback: false,
    }));
  };

  // Change category
  const setCategory = (category: string) => {
    setSessionState(prev => ({
      ...prev,
      category,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showFeedback: false,
    }));
  };

  // Toggle bookmark for current question
  const toggleBookmark = () => {
    if (!currentQuestion) return;
    
    const existingProgress = userProgress.find((p: any) => p.questionId === currentQuestion.id);
    const isCurrentlyBookmarked = existingProgress?.isBookmarked || false;
    
    toggleBookmarkMutation.mutate({
      questionId: currentQuestion.id,
      isBookmarked: !isCurrentlyBookmarked,
    });
  };

  // Close feedback modal
  const closeFeedback = () => {
    setSessionState(prev => ({
      ...prev,
      showFeedback: false,
    }));
  };

  // Check if current question is bookmarked
  const isCurrentQuestionBookmarked = () => {
    if (!currentQuestion) return false;
    const progress = userProgress.find((p: any) => p.questionId === currentQuestion.id);
    return progress?.isBookmarked || false;
  };

  // Calculate progress percentage
  const progressPercentage = questions.length > 0 
    ? Math.round((sessionState.currentQuestionIndex / questions.length) * 100)
    : 0;

  return {
    // State
    questions,
    currentQuestion,
    currentQuestionIndex: sessionState.currentQuestionIndex,
    selectedAnswer: sessionState.selectedAnswer,
    showFeedback: sessionState.showFeedback,
    studyMode: sessionState.studyMode,
    category: sessionState.category,
    questionsAnswered: sessionState.questionsAnswered,
    correctAnswers: sessionState.correctAnswers,
    progressPercentage,
    isLoading,
    userStats,
    
    // Actions
    selectAnswer,
    nextQuestion,
    previousQuestion,
    setStudyMode,
    setCategory,
    toggleBookmark,
    closeFeedback,
    isCurrentQuestionBookmarked,
    
    // Computed
    hasNext: sessionState.currentQuestionIndex < questions.length - 1,
    hasPrevious: sessionState.currentQuestionIndex > 0,
    isAnswered: sessionState.selectedAnswer !== null,
  };
}
