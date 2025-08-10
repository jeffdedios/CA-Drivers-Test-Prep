import { Question } from "@shared/schema";

export const CATEGORIES = [
  { id: "all", name: "All Topics", icon: "fas fa-list" },
  { id: "signs", name: "Traffic Signs", icon: "fas fa-sign" },
  { id: "laws", name: "Traffic Laws", icon: "fas fa-gavel" },
  { id: "safety", name: "Safety", icon: "fas fa-shield-alt" },
  { id: "alcohol", name: "Alcohol & Drugs", icon: "fas fa-wine-bottle" },
];

export const STUDY_MODES = [
  { id: "sequential", name: "Sequential", icon: "fas fa-list-ol" },
  { id: "random", name: "Random", icon: "fas fa-random" },
  { id: "review", name: "Review", icon: "fas fa-bookmark" },
];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuestionOrder(questions: Question[], mode: string, userId: string): Question[] {
  switch (mode) {
    case "random":
      return shuffleArray(questions);
    case "review":
      // This would normally filter based on user progress
      return questions.filter(q => q.difficulty === "medium" || q.difficulty === "hard");
    case "sequential":
    default:
      return questions;
  }
}

export function getCategoryName(categoryId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.name || "Unknown Category";
}

export function getCategoryIcon(categoryId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.icon || "fas fa-question";
}
