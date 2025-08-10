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
      // Traffic Laws & Rules (15 questions)
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
        id: "3",
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
        id: "4",
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
      },
      {
        id: "5",
        category: "laws",
        questionText: "You should signal at least how many feet before making a turn?",
        options: [
          "50 feet",
          "100 feet",
          "200 feet",
          "300 feet"
        ],
        correctAnswer: 1,
        explanation: "You should signal at least 100 feet before you turn to give other drivers and pedestrians adequate warning.",
        section: "Section 5",
        difficulty: "easy"
      },
      {
        id: "6",
        category: "laws",
        questionText: "Double solid yellow lines mean:",
        options: [
          "Passing is allowed when safe",
          "No passing in either direction",
          "Passing allowed only on the right",
          "Caution, steep hill ahead"
        ],
        correctAnswer: 1,
        explanation: "Double solid yellow lines mean no passing is allowed in either direction. Stay to the right of these lines unless specifically instructed otherwise.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "7",
        category: "laws",
        questionText: "A broken white line between lanes means:",
        options: [
          "No lane changes allowed",
          "Lane changes are discouraged",
          "Lane changes are permitted when safe",
          "Only emergency vehicles may change lanes"
        ],
        correctAnswer: 2,
        explanation: "Broken white lines separate traffic lanes going in the same direction and indicate that lane changes are permitted when safe.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "8",
        category: "laws",
        questionText: "If you move to California, you must get a California driver's license within:",
        options: [
          "10 days",
          "20 days",
          "30 days",
          "60 days"
        ],
        correctAnswer: 0,
        explanation: "If you become a California resident, you must get a California driver's license within 10 days.",
        section: "Section 1",
        difficulty: "medium"
      },
      {
        id: "9",
        category: "laws",
        questionText: "The speed limit on most California freeways is:",
        options: [
          "55 mph",
          "60 mph",
          "65 mph",
          "70 mph"
        ],
        correctAnswer: 2,
        explanation: "The speed limit on most California freeways is 65 mph unless otherwise posted.",
        section: "Section 7",
        difficulty: "easy"
      },
      {
        id: "10",
        category: "laws",
        questionText: "You must notify DMV within how many days if you change your address?",
        options: [
          "5 days",
          "10 days",
          "15 days",
          "30 days"
        ],
        correctAnswer: 1,
        explanation: "You must notify DMV of your new address within 10 days of moving.",
        section: "Section 4",
        difficulty: "easy"
      },
      {
        id: "11",
        category: "laws",
        questionText: "In a business or residential area, what is the speed limit near schools and playgrounds?",
        options: [
          "15 mph",
          "20 mph", 
          "25 mph",
          "30 mph"
        ],
        correctAnswer: 0,
        explanation: "The speed limit is 15 mph in school zones and near playgrounds when children are present.",
        section: "Section 7",
        difficulty: "medium"
      },
      {
        id: "12",
        category: "laws",
        questionText: "You may pass on the right when:",
        options: [
          "The vehicle ahead is turning left and there is room",
          "You are on a one-way street",
          "On multi-lane highways",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "You may pass on the right when the vehicle ahead is turning left, on one-way streets, or on multi-lane highways when safe.",
        section: "Section 7",
        difficulty: "medium"
      },
      {
        id: "13",
        category: "laws",
        questionText: "When parking uphill on a street with a curb, your wheels should be:",
        options: [
          "Turned toward the curb",
          "Turned away from the curb",
          "Straight",
          "It doesn't matter"
        ],
        correctAnswer: 1,
        explanation: "When parking uphill with a curb, turn your wheels away from the curb so the vehicle will roll away from traffic if the brakes fail.",
        section: "Section 7",
        difficulty: "medium"
      },
      {
        id: "14",
        category: "laws",
        questionText: "A provisional license restricts drivers under 18 from driving between:",
        options: [
          "10 PM and 5 AM",
          "11 PM and 5 AM",
          "12 AM and 6 AM",
          "9 PM and 6 AM"
        ],
        correctAnswer: 1,
        explanation: "Provisional license holders under 18 cannot drive between 11 PM and 5 AM during their first 12 months.",
        section: "Section 2",
        difficulty: "medium"
      },
      {
        id: "15",
        category: "laws",
        questionText: "You are required to stop at a railroad crossing when:",
        options: [
          "You see a train approaching",
          "Red lights are flashing",
          "A crossing gate is lowered",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "You must stop at railroad crossings when you see a train approaching, red lights are flashing, or crossing gates are lowered.",
        section: "Section 7",
        difficulty: "easy"
      },

      // Traffic Signs (15 questions)
      {
        id: "16",
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
        id: "17",
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
        id: "18",
        category: "signs",
        questionText: "An octagonal (8-sided) red sign means:",
        options: [
          "Yield",
          "Stop",
          "Do not enter",
          "Slow down"
        ],
        correctAnswer: 1,
        explanation: "An octagonal red sign is always a stop sign, requiring you to come to a complete stop.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "19",
        category: "signs",
        questionText: "A yellow sign with black letters or symbols warns you of:",
        options: [
          "Road construction ahead",
          "Changes in direction or lane usage",
          "Services such as gas or food",
          "Speed limits"
        ],
        correctAnswer: 1,
        explanation: "Yellow signs with black letters or symbols are warning signs that alert you to changes in direction, lane usage, or hazards ahead.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "20",
        category: "signs",
        questionText: "A white rectangular sign with black letters indicates:",
        options: [
          "Warning information",
          "Regulatory information",
          "Guide information",
          "Construction zones"
        ],
        correctAnswer: 1,
        explanation: "White rectangular signs with black letters provide regulatory information such as speed limits, parking regulations, and traffic laws.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "21",
        category: "signs",
        questionText: "A red circle with a line through it means:",
        options: [
          "Caution",
          "Warning",
          "Prohibited action",
          "Construction zone"
        ],
        correctAnswer: 2,
        explanation: "A red circle with a line through it is a prohibition sign, indicating that the action shown is not allowed.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "22",
        category: "signs",
        questionText: "Green signs typically provide information about:",
        options: [
          "Warnings and hazards",
          "Regulatory requirements",
          "Directions and distances",
          "Construction zones"
        ],
        correctAnswer: 2,
        explanation: "Green signs provide guidance information such as directions, distances to destinations, and highway exits.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "23",
        category: "signs",
        questionText: "A diamond-shaped orange sign indicates:",
        options: [
          "School zone",
          "Construction or maintenance zone",
          "Railroad crossing",
          "Hospital zone"
        ],
        correctAnswer: 1,
        explanation: "Orange diamond-shaped signs indicate construction or maintenance work zones where special caution is required.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "24",
        category: "signs",
        questionText: "A blue sign with white symbols typically indicates:",
        options: [
          "Services for motorists",
          "Construction zones",
          "Speed limits",
          "Parking restrictions"
        ],
        correctAnswer: 0,
        explanation: "Blue signs with white symbols indicate services for motorists such as gas, food, lodging, and rest areas.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "25",
        category: "signs",
        questionText: "A pentagon-shaped sign indicates:",
        options: [
          "Railroad crossing",
          "School zone",
          "Construction zone",
          "Hospital zone"
        ],
        correctAnswer: 1,
        explanation: "Pentagon-shaped signs are used for school zones and school crossings.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "26",
        category: "signs",
        questionText: "What does a circular yellow sign with an X and RR mean?",
        options: [
          "Road construction",
          "Railroad crossing ahead",
          "Intersection ahead",
          "Merge ahead"
        ],
        correctAnswer: 1,
        explanation: "A circular yellow sign with an X and RR warns of a railroad crossing ahead.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "27",
        category: "signs",
        questionText: "A brown sign typically indicates:",
        options: [
          "Construction zones",
          "Speed limits",
          "Recreational areas and points of interest",
          "Emergency services"
        ],
        correctAnswer: 2,
        explanation: "Brown signs indicate recreational areas, points of interest, and cultural sites.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "28",
        category: "signs",
        questionText: "What does a sign with a red background and white letters typically indicate?",
        options: [
          "Warning",
          "Prohibition or danger",
          "Information",
          "Construction"
        ],
        correctAnswer: 1,
        explanation: "Red signs with white letters typically indicate prohibition, danger, or that something is not allowed.",
        section: "Section 6",
        difficulty: "easy"
      },
      {
        id: "29",
        category: "signs",
        questionText: "A yield line consists of:",
        options: [
          "A solid white line",
          "A broken yellow line",
          "White triangles pointing toward approaching vehicles",
          "Double yellow lines"
        ],
        correctAnswer: 2,
        explanation: "A yield line consists of white triangles pointing toward approaching vehicles, indicating where to yield or stop.",
        section: "Section 6",
        difficulty: "medium"
      },
      {
        id: "30",
        category: "signs",
        questionText: "What does a sign showing a bicycle mean?",
        options: [
          "Bicycles prohibited",
          "Bicycle route or lane",
          "Bicycle crossing",
          "Bicycle parking"
        ],
        correctAnswer: 1,
        explanation: "Signs showing a bicycle indicate a bicycle route, lane, or path designated for bicycle use.",
        section: "Section 6",
        difficulty: "easy"
      },

      // Safety & Defensive Driving (10 questions)
      {
        id: "31",
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
        id: "32",
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
        id: "33",
        category: "safety",
        questionText: "You must use your headlights:",
        options: [
          "30 minutes after sunset until 30 minutes before sunrise",
          "Only when it's completely dark",
          "Only in bad weather",
          "Only on freeways"
        ],
        correctAnswer: 0,
        explanation: "You must use headlights 30 minutes after sunset until 30 minutes before sunrise, and anytime visibility is reduced.",
        section: "Section 5",
        difficulty: "medium"
      },
      {
        id: "34",
        category: "safety",
        questionText: "When should you use your horn?",
        options: [
          "To express anger at other drivers",
          "To alert others of your presence or warn of hazards",
          "When passing other vehicles",
          "In residential areas at night"
        ],
        correctAnswer: 1,
        explanation: "Use your horn to alert others of your presence or warn of hazards, not to express anger or frustration.",
        section: "Section 5",
        difficulty: "easy"
      },
      {
        id: "35",
        category: "safety",
        questionText: "The best way to avoid fatigue when driving long distances is to:",
        options: [
          "Drink coffee regularly",
          "Take frequent breaks and rest when tired",
          "Drive faster to reach your destination sooner",
          "Listen to loud music"
        ],
        correctAnswer: 1,
        explanation: "Take frequent breaks and rest when tired. Fatigue impairs driving ability and increases accident risk.",
        section: "Section 5",
        difficulty: "easy"
      },
      {
        id: "36",
        category: "safety",
        questionText: "When driving in fog, you should:",
        options: [
          "Use high-beam headlights",
          "Use low-beam headlights and reduce speed",
          "Use parking lights only",
          "Follow other vehicles closely"
        ],
        correctAnswer: 1,
        explanation: "Use low-beam headlights in fog and reduce speed. High beams reflect off fog and reduce visibility.",
        section: "Section 8",
        difficulty: "medium"
      },
      {
        id: "37",
        category: "safety",
        questionText: "The proper hand position on the steering wheel is:",
        options: [
          "10 and 2 o'clock",
          "9 and 3 o'clock or 8 and 4 o'clock",
          "12 and 6 o'clock",
          "Any comfortable position"
        ],
        correctAnswer: 1,
        explanation: "The recommended hand position is 9 and 3 o'clock or 8 and 4 o'clock for better control and safety with airbags.",
        section: "Section 5",
        difficulty: "easy"
      },
      {
        id: "38",
        category: "safety",
        questionText: "When backing up, you should:",
        options: [
          "Use only your mirrors",
          "Look over your shoulder in the direction you're moving",
          "Rely on backup cameras only",
          "Back up quickly to get it over with"
        ],
        correctAnswer: 1,
        explanation: "Look over your shoulder in the direction you're moving when backing up. Don't rely solely on mirrors or cameras.",
        section: "Section 5",
        difficulty: "easy"
      },
      {
        id: "39",
        category: "safety",
        questionText: "What should you do if your vehicle starts to skid?",
        options: [
          "Brake hard immediately",
          "Steer in the opposite direction of the skid",
          "Ease off the gas and steer in the direction you want to go",
          "Speed up to regain control"
        ],
        correctAnswer: 2,
        explanation: "If your vehicle skids, ease off the gas and steer gently in the direction you want the vehicle to go.",
        section: "Section 8",
        difficulty: "medium"
      },
      {
        id: "40",
        category: "safety",
        questionText: "You should check your blind spots:",
        options: [
          "Only when changing lanes",
          "Before changing lanes and when merging",
          "Only in heavy traffic",
          "Once per trip"
        ],
        correctAnswer: 1,
        explanation: "Always check blind spots before changing lanes, merging, or making turns to ensure the path is clear.",
        section: "Section 6",
        difficulty: "easy"
      },

      // Alcohol & Drugs (10 questions)
      {
        id: "41",
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
        id: "42",
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
        id: "43",
        category: "alcohol",
        questionText: "The legal BAC limit for drivers 21 and over in California is:",
        options: [
          "0.05%",
          "0.08%",
          "0.10%",
          "0.12%"
        ],
        correctAnswer: 1,
        explanation: "The legal BAC limit for drivers 21 and over is 0.08%. For drivers under 21, it's 0.01%.",
        section: "Section 9",
        difficulty: "easy"
      },
      {
        id: "44",
        category: "alcohol",
        questionText: "For drivers under 21, the legal BAC limit is:",
        options: [
          "0.01%",
          "0.02%",
          "0.05%",
          "0.08%"
        ],
        correctAnswer: 0,
        explanation: "California has a zero tolerance policy for drivers under 21. The legal limit is 0.01% BAC.",
        section: "Section 9",
        difficulty: "easy"
      },
      {
        id: "45",
        category: "alcohol",
        questionText: "Alcohol affects your:",
        options: [
          "Judgment and reaction time",
          "Vision and coordination",
          "Concentration and perception",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Alcohol affects all aspects of driving ability including judgment, reaction time, vision, coordination, concentration, and perception.",
        section: "Section 9",
        difficulty: "easy"
      },
      {
        id: "46",
        category: "alcohol",
        questionText: "If you refuse to take a chemical test for alcohol, your license will be suspended for:",
        options: [
          "6 months",
          "1 year",
          "2 years",
          "3 years"
        ],
        correctAnswer: 1,
        explanation: "Refusing a chemical test results in an automatic 1-year license suspension for first offense.",
        section: "Section 9",
        difficulty: "medium"
      },
      {
        id: "47",
        category: "alcohol",
        questionText: "Prescription medications:",
        options: [
          "Are always safe to use while driving",
          "Can impair your driving ability",
          "Only affect driving if you feel drowsy",
          "Are legal so they don't matter"
        ],
        correctAnswer: 1,
        explanation: "Prescription medications can impair driving ability. It's your responsibility to know the effects of medications you take.",
        section: "Section 9",
        difficulty: "medium"
      },
      {
        id: "48",
        category: "alcohol",
        questionText: "DUI laws apply to:",
        options: [
          "Alcohol only",
          "Illegal drugs only",
          "Prescription medications only",
          "Alcohol, illegal drugs, and prescription medications"
        ],
        correctAnswer: 3,
        explanation: "DUI laws apply to driving under the influence of alcohol, illegal drugs, and prescription medications that impair driving ability.",
        section: "Section 9",
        difficulty: "medium"
      },
      {
        id: "49",
        category: "alcohol",
        questionText: "One drink equals:",
        options: [
          "12 oz beer, 5 oz wine, or 1.5 oz hard liquor",
          "16 oz beer, 6 oz wine, or 2 oz hard liquor",
          "8 oz beer, 4 oz wine, or 1 oz hard liquor",
          "Any amount you can handle"
        ],
        correctAnswer: 0,
        explanation: "One standard drink equals 12 oz of beer, 5 oz of wine, or 1.5 oz of 80-proof hard liquor.",
        section: "Section 9",
        difficulty: "medium"
      },
      {
        id: "50",
        category: "alcohol",
        questionText: "The best way to avoid a DUI is to:",
        options: [
          "Drink coffee before driving",
          "Wait one hour after drinking",
          "Have a designated driver or use alternative transportation",
          "Drive slowly and carefully"
        ],
        correctAnswer: 2,
        explanation: "The best way to avoid DUI is to plan ahead with a designated driver, rideshare, public transportation, or other alternatives.",
        section: "Section 9",
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
      section: insertQuestion.section || null,
      difficulty: insertQuestion.difficulty || null
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
