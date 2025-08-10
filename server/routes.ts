import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all questions or filter by category
  app.get("/api/questions", async (req, res) => {
    try {
      const category = req.query.category as string;
      const questions = category 
        ? await storage.getQuestionsByCategory(category)
        : await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Get a specific question
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const question = await storage.getQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  // Get user progress
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Update user progress for a question
  app.post("/api/progress/:userId/:questionId", async (req, res) => {
    try {
      const { userId, questionId } = req.params;
      const updateData = req.body;
      
      const progress = await storage.updateUserProgress(userId, questionId, updateData);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Get bookmarked questions
  app.get("/api/bookmarks/:userId", async (req, res) => {
    try {
      const bookmarked = await storage.getBookmarkedQuestions(req.params.userId);
      res.json(bookmarked);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  // Toggle bookmark
  app.post("/api/bookmarks/:userId/:questionId", async (req, res) => {
    try {
      const { userId, questionId } = req.params;
      const { isBookmarked } = req.body;
      
      const progress = await storage.updateUserProgress(userId, questionId, {
        isBookmarked
      });
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle bookmark" });
    }
  });

  // Get user statistics
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Start a study session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to create study session" });
    }
  });

  // Update study session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const session = await storage.updateStudySession(id, updates);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update study session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
