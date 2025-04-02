import React, { useState, useEffect, useRef } from "react";
import { User, Menu, MessageSquare, CheckCircle, Clock } from "lucide-react";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Import Components
import QuestionCard from "../components/portalPage/QuestionCard";
import AnswerCard from "../components/portalPage/AnswerCard";
import FeedbackCard from "../components/portalPage/FeedbackCard";
import Navbar from "../components/portalPage/Navbar";

// Sample data
const questions = [
  {
    id: 1,
    text: "Can you describe a challenging project you've worked on and how you overcame obstacles?",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Include specific metrics and outcomes when possible",
      "Be concise but thorough in your explanation",
    ],
    keywords: [
      "problem-solving",
      "persistence",
      "teamwork",
      "innovation",
      "adaptation",
    ],
  },
  {
    id: 2,
    text: "Tell me about a time when you had to work with a difficult team member.",
    tips: [
      "Focus on the situation, not the person",
      "Highlight your communication approaches",
      "Explain the positive resolution",
    ],
    keywords: [
      "conflict resolution",
      "empathy",
      "communication",
      "collaboration",
      "patience",
    ],
  },
  {
    id: 3,
    text: "How do you prioritize tasks when you have multiple deadlines?",
    tips: [
      "Describe your methodology or framework",
      "Provide a specific example",
      "Explain how you communicate priorities to stakeholders",
    ],
    keywords: [
      "time management",
      "organization",
      "decision-making",
      "flexibility",
      "stress management",
    ],
  },
];

// const interviewTypes = [
//   { id: 1, name: "Frontend Developer", active: true },
//   { id: 2, name: "Backend Developer", active: false },
//   { id: 3, name: "Full Stack Engineer", active: false },
// ];

// Main Interview Portal Component
const InterviewPage = () => {
  // State management

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [showKeywords, setShowKeywords] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // References
  // const timerRef = useRef(null);
  const textareaRef = useRef(null);

  // Set focus on textarea when needed
  useEffect(() => {
    if (!isSubmitted && textareaRef.current) textareaRef.current.focus();
  }, [currentQuestionIndex, isSubmitted]);

  // Handlers
  const handleSubmit = () => {
    setIsTimerActive(false);
    setIsSubmitted(true);

    // Simulate AI feedback generation
    setTimeout(() => {
      const keywords = questions[currentQuestionIndex].keywords;
      const strengths = [];
      const improvements = [];

      // Simple keyword matching simulation
      const answerLower = currentAnswer.toLowerCase();
      let keywordsFound = 0;

      keywords.forEach((keyword) => {
        if (answerLower.includes(keyword.toLowerCase())) {
          keywordsFound++;
          strengths.push(`Good use of ${keyword} concept in your answer`);
        } else {
          improvements.push(`Consider addressing ${keyword} in your response `);
        }
      });

      // Length-based feedback
      if (currentAnswer.length > 500)
        strengths.push("Detailed and comprehensive response");
      else if (currentAnswer.length < 200)
        improvements.push("Try to provide more details in your answer");

      // Calculate score based on keywords and length
      const keywordScore = (keywordsFound / keywords.length) * 70;
      const lengthScore = Math.min(30, (currentAnswer.length / 500) * 30);
      const totalScore = Math.round(keywordScore + lengthScore);

      setFeedback({
        strengths: strengths.slice(0, 3),
        improvements: improvements.slice(0, 3),
        score: totalScore,
      });
    }, 1000);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setCurrentAnswer("");
    setIsSubmitted(false);
    setFeedback(null);
    // setTimer(0);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);

    // Simulate speech-to-text
    if (!isRecording) {
      setIsTimerActive(true);
      setTimeout(() => {
        setCurrentAnswer(
          (prev) =>
            prev +
            (prev ? " " : "") +
            "In my previous role at ABC Tech, I was assigned to a challenging project with an impossible deadline. The client needed a complete e-commerce platform built in just six weeks, when such projects typically take three months. I organized the team using an agile approach with two-day sprints, prioritized features using MoSCoW method, and leveraged existing components where possible. We delivered the core functionality on time, resulting in a 15% increase in the client's conversion rate within the first month.",
        );
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-grow lg:ml-0 flex flex-col">
        {/* Navbar */}
        <Navbar
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />

        {/* Main Interview Area */}
        <div
          className={`p-4 md:p-6 lg:p-8 flex-grow overflow-y-auto ${isSubmitted ? "" : "flex justify-center"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full  mx-auto">
            {/* Question Section */}
            <QuestionCard
              question={questions[currentQuestionIndex]}
              showTips={showTips}
              setShowTips={setShowTips}
              showKeywords={showKeywords}
              setShowKeywords={setShowKeywords}
              isTimerActive={isTimerActive}
              setIsTimerActive={setIsTimerActive}
            />

            {/* Answer Section */}
            <AnswerCard
              isSubmitted={isSubmitted}
              currentAnswer={currentAnswer}
              setCurrentAnswer={setCurrentAnswer}
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              handleSubmit={handleSubmit}
              handleNextQuestion={handleNextQuestion}
              textareaRef={textareaRef}
            />
          </div>

          {/* AI Feedback Section */}
          {isSubmitted && feedback && <FeedbackCard feedback={feedback} />}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
