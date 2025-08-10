import { type Question, type InsertQuestion, type UserProgress, type InsertUserProgress, type StudySession, type InsertStudySession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Questions
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByCategory(category: string): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getQuestionProgress(userId: string, questionId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, questionId: string, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  getBookmarkedQuestions(userId: string): Promise<Question[]>;
  
  // Study Sessions
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession>;
  getUserStats(userId: string): Promise<{
    totalAnswered: number;
    totalCorrect: number;
    categoryStats: Array<{
      category: string;
      answered: number;
      correct: number;
      accuracy: number;
    }>;
  }>;
}

export class MemStorage implements IStorage {
  private questions: Map<string, Question>;
  private userProgress: Map<string, UserProgress>;
  private studySessions: Map<string, StudySession>;

  constructor() {
    this.questions = new Map();
    this.userProgress = new Map();
    this.studySessions = new Map();
    this.seedQuestions();
  }

  private seedQuestions() {
    // Real questions from CA Driver's Handbook
    const sampleQuestions: Question[] = [
      {
        id: "1",
        category: "laws",
        questionText: "When you are driving on a freeway and need to merge into traffic, you should:",
        options: [
          "Stop and wait for a large gap in traffic",
          "Signal and merge as quickly as possible",
          "Match the speed of traffic and signal your intention",
          "Merge without signaling if traffic is light"
        ],
        correctAnswer: 2,
        explanation: "According to the CA Driver's Handbook, safe merging requires matching traffic speed and proper signaling to ensure smooth traffic flow.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "2",
        category: "signs",
        questionText: "A red and white triangular sign at an intersection means:",
        options: [
          "Stop completely",
          "Yield the right-of-way", 
          "Proceed with caution",
          "No left turn"
        ],
        correctAnswer: 1,
        explanation: "A red and white triangular sign is a yield sign, which means you must yield the right-of-way to other vehicles and pedestrians.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "3",
        category: "laws",
        questionText: "What is the speed limit in a business or residential district unless otherwise posted?",
        options: [
          "20 mph",
          "25 mph",
          "30 mph", 
          "35 mph"
        ],
        correctAnswer: 1,
        explanation: "The speed limit in business and residential districts is 25 mph unless otherwise posted, as stated in the California Vehicle Code.",
        section: "Section 7",
        difficulty: "easy"
      },
      {
        id: "4",
        category: "alcohol",
        questionText: "Your blood alcohol concentration (BAC) depends on all of the following except:",
        options: [
          "Your weight",
          "How much you drink",
          "How fast you drink",
          "What you had for breakfast"
        ],
        correctAnswer: 3,
        explanation: "BAC depends on your weight, amount consumed, and rate of consumption. What you eat affects absorption rate but breakfast specifically is not a determining factor.",
        section: "Section 9",
        difficulty: "medium"
      },
      {
        id: "5",
        category: "safety",
        questionText: "You must dim your high-beam headlights to low beams within how many feet of a vehicle coming toward you?",
        options: [
          "300 feet",
          "400 feet",
          "500 feet",
          "600 feet"
        ],
        correctAnswer: 2,
        explanation: "You must dim your high-beam headlights to low beams within 500 feet of a vehicle coming toward you or within 300 feet of a vehicle you are following.",
        section: "Section 5",
        difficulty: "medium"
      },
      {
        id: "6",
        category: "laws",
        questionText: "When changing lanes, you should signal at least how many seconds before changing lanes on a freeway?",
        options: [
          "3 seconds",
          "5 seconds",
          "7 seconds",
          "10 seconds"
        ],
        correctAnswer: 1,
        explanation: "You should signal at least 5 seconds before changing lanes on a freeway to give other drivers adequate warning.",
        section: "Section 5",
        difficulty: "easy"
      },
      {
        id: "7",
        category: "signs",
        questionText: "What does a yellow diamond-shaped sign with a black arrow curving to the right mean?",
        options: [
          "Right turn only",
          "Curve ahead to the right",
          "Merge right",
          "Exit ramp"
        ],
        correctAnswer: 1,
        explanation: "Yellow diamond-shaped signs are warning signs. An arrow curving to the right warns of a curve ahead in that direction.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "8",
        category: "safety",
        questionText: "If you are driving slowly on a two-lane road where passing is unsafe and five or more vehicles are following you, you must:",
        options: [
          "Speed up to match traffic flow",
          "Pull over and let them pass",
          "Use a turnout area or lane to let other vehicles pass",
          "Continue at your current speed"
        ],
        correctAnswer: 2,
        explanation: "You must use a turnout area or lane to let other vehicles pass when driving slowly and five or more vehicles are following you.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "9",
        category: "alcohol",
        questionText: "Which of the following statements about alcohol is true?",
        options: [
          "Coffee can help you sober up faster",
          "Cold showers reduce blood alcohol level",
          "Only time can reduce blood alcohol concentration",
          "Eating after drinking reduces BAC immediately"
        ],
        correctAnswer: 2,
        explanation: "Only time can reduce blood alcohol concentration. The liver processes alcohol at a fixed rate that cannot be accelerated by coffee, showers, or food.",
        section: "Section 9",
        difficulty: "medium"
      },
      {
        id: "10",
        category: "laws",
        questionText: "When must you stop for a school bus?",
        options: [
          "Only when children are visible",
          "When red lights are flashing and stop sign is extended",
          "Only on school days",
          "When the bus is moving slowly"
        ],
        correctAnswer: 1,
        explanation: "You must stop when a school bus has its red lights flashing and stop sign extended, regardless of whether children are visible.",
        section: "Section 7",
        difficulty: "easy"
      }
    ];

    sampleQuestions.forEach(question => {
      this.questions.set(question.id, question);
    });
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    if (category === "all") {
      return this.getAllQuestions();
    }
    return Array.from(this.questions.values()).filter(q => q.category === category);
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = { 
      ...insertQuestion, 
      id,
      section: insertQuestion.section || "",
      difficulty: insertQuestion.difficulty || "medium"
    };
    this.questions.set(id, question);
    return question;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getQuestionProgress(userId: string, questionId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => 
      p.userId === userId && p.questionId === questionId
    );
  }

  async updateUserProgress(userId: string, questionId: string, updates: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existing = await this.getQuestionProgress(userId, questionId);
    let progress: UserProgress;
    
    if (existing) {
      progress = { ...existing, ...updates };
    } else {
      const id = randomUUID();
      progress = {
        id,
        userId,
        questionId,
        isBookmarked: false,
        timesAnswered: 0,
        timesCorrect: 0,
        lastAnswered: null,
        markedForReview: false,
        ...updates
      };
    }
    
    this.userProgress.set(progress.id, progress);
    return progress;
  }

  async getBookmarkedQuestions(userId: string): Promise<Question[]> {
    const bookmarked = Array.from(this.userProgress.values())
      .filter(p => p.userId === userId && p.isBookmarked)
      .map(p => p.questionId);
    
    return Array.from(this.questions.values())
      .filter(q => bookmarked.includes(q.id));
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = randomUUID();
    const session: StudySession = { 
      ...insertSession, 
      id,
      category: insertSession.category || "all",
      questionsAnswered: insertSession.questionsAnswered || 0,
      correctAnswers: insertSession.correctAnswers || 0,
      startedAt: new Date(),
      completedAt: null
    };
    this.studySessions.set(id, session);
    return session;
  }

  async updateStudySession(id: string, updates: Partial<StudySession>): Promise<StudySession> {
    const existing = this.studySessions.get(id);
    if (!existing) {
      throw new Error("Study session not found");
    }
    const updated = { ...existing, ...updates };
    this.studySessions.set(id, updated);
    return updated;
  }

  async getUserStats(userId: string): Promise<{
    totalAnswered: number;
    totalCorrect: number;
    categoryStats: Array<{
      category: string;
      answered: number;
      correct: number;
      accuracy: number;
    }>;
  }> {
    const userProgressData = await this.getUserProgress(userId);
    
    const totalAnswered = userProgressData.reduce((sum, p) => sum + p.timesAnswered, 0);
    const totalCorrect = userProgressData.reduce((sum, p) => sum + p.timesCorrect, 0);
    
    // Calculate category stats
    const categoryMap = new Map<string, { answered: number; correct: number }>();
    
    for (const progress of userProgressData) {
      const question = await this.getQuestion(progress.questionId);
      if (!question) continue;
      
      const current = categoryMap.get(question.category) || { answered: 0, correct: 0 };
      current.answered += progress.timesAnswered || 0;
      current.correct += progress.timesCorrect || 0;
      categoryMap.set(question.category, current);
    }
    
    const categoryStats = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      answered: stats.answered,
      correct: stats.correct,
      accuracy: stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0
    }));
    
    return {
      totalAnswered,
      totalCorrect,
      categoryStats
    };
  }
}

export const storage = new MemStorage();
