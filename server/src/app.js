import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";

const app = express();
// path.resolve() in ES modules when run from the root gives the project root directory
const __dirname = path.resolve();

// Middleware setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// A special raw body parser for the Stripe webhook
import { stripeWebhook } from "./controllers/payment.controllers.js";
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Server's public folder
app.use(cookieParser());

// --- ROUTES ---
import userRouter from "./routes/user.routes.js";
import exchangeRouter from "./routes/exchange.routes.js";
import topicRouter from "./routes/topic.routes.js";
import projectRouter from "./routes/project.routes.js";
import skillTreeRouter from "./routes/skillTree.routes.js";
import achievementRouter from "./routes/achievement.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";
import forumRouter from "./routes/forum.routes.js";
import postRouter from "./routes/post.routes.js";
import mentorRouter from "./routes/mentor.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import recordingRouter from "./routes/recording.routes.js";
import assessmentRouter from "./routes/assessment.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import eventRouter from "./routes/event.routes.js";
import featureRequestRouter from "./routes/featureRequest.routes.js";
import onboardingRouter from "./routes/onboarding.routes.js";
import agreementRouter from "./routes/agreement.routes.js";
import disputeRouter from "./routes/dispute.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/exchanges", exchangeRouter);
app.use("/api/v1/topics", topicRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/skill-trees", skillTreeRouter);
app.use("/api/v1/achievements", achievementRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/forums", forumRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/mentors", mentorRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/recordings", recordingRouter);
app.use("/api/v1/assessment", assessmentRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/feature-requests", featureRequestRouter);
app.use("/api/v1/onboarding", onboardingRouter);
app.use("/api/v1/agreements", agreementRouter);
app.use("/api/v1/disputes", disputeRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// --- DEPLOYMENT CONFIGURATION ---
// This part serves the frontend in production
if (process.env.NODE_ENV === "production") {
  // Since the start command is run from the root 'knowle' folder,
  // we point directly to client/dist
  const clientBuildPath = path.join(__dirname, "client", "dist");

  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));

    // For any request that doesn't match an API route, serve the React index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });
  } else {
    // Fallback if the build folder isn't found during runtime
    app.get("*", (req, res) => {
      res.status(500).send("Frontend build not found. Verify build step.");
    });
  }
} else {
  // Fallback for local development
  app.get("*", (req, res) => {
    res.status(404).json({ message: "API Route not found" });
  });
}

export { app };
