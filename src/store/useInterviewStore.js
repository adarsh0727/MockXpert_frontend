import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useInterviewStore = create((set, get) => ({
  formData: {
    name: "",
    company: "",
    role: "",
    experience: "",
    prefferedLanguage: "",
    codingRound: false,
  },

  interviewId: null,
  enableNextQuestion: false,
  generatingResponse: false,

  messages: [
    { id: 1, role: "assistant", content: "Hello! How can I help you today?" },
    { id: 2, role: "user", content: "I have a question about React." },
    {
      id: 3,
      role: "content",
      content:
        "Sure, I'd be happy to help with your React question. What would you like to know?",
    },
  ],

  allConversations: [], // Stores all conversations
  currentConversation: [],

  isLoading: false,

  setFormData: async (data) => {
    set({ isLoading: true });

    const { generateNewQuestion } = get();

    console.log("Sending data:", data);
    const response = await axiosInstance.post("/interview", data);
    console.log("Response received:", response.data);

    set((state) => ({
      formData: { ...state.formData, ...data },
      interviewId: response.data.interviewId, // Store interview ID
    }));

    generateNewQuestion();

    set({ isLoading: false });
  },

  generateNewQuestion: async () => {
    set({ isLoading: true });
    set({ enableNextQuestion: false });

    const { formData, currentConversation } = get();

    set((state) => ({
      allConversations: [...state.allConversations, currentConversation],
    }));

    const {
      jobRole,
      targetCompany,
      preferredLanguage,
      yearsOfExperience,
      codingRound,
    } = formData;

    const systemContext = `
        You are an experienced interviewer with 20+ years in technical interviews for the job role of ${jobRole} at companies like ${targetCompany}.
        Please provide a relevant interview question for this role, based on current trends and typical interview questions for ${jobRole} at ${targetCompany}.
        If the role is technical (e.g., Software Engineer, Data Scientist), provide a coding or problem-solving question in ${preferredLanguage}. Otherwise, provide a theoretical question as per the questions asked for ${jobRole} role Interview.
      `;

    let prompt = "";
    if (codingRound) {
      prompt = `Generate a medium-level technical question for a ${jobRole} position at ${targetCompany}, considering ${yearsOfExperience} years of experience and ${preferredLanguage} as the main programming language.`;
    } else {
      prompt = `Generate a theoretical question for a ${jobRole} position at ${targetCompany} with ${yearsOfExperience} years of experience.`;
    }

    const conv = [
      {
        role: "developer",
        content: systemContext,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await axiosInstance.post("/chat", {
      messagses: conv,
    });

    console.log("Response received:", response.data);

    set({ currentConversation: response.data.reply });

    set({ isLoading: false });
  },

  // Function to add messages to the state
  // addMessage: (message) =>
  //   set((state) => ({ messages: [...state.messages, message] })),

  // Function to send user input and get AI response
  sendMessage: async (event) => {
    set({ generatingResponse: true });

    event.preventDefault();
    const userMessage = event.target.querySelector("textarea").value;

    console.log(userMessage);

    const { currentConversation } = get();

    // Add user message to chat history
    set((state) => ({
      currentConversation: [
        ...state.currentConversation,
        { content: userMessage, role: "user" },
      ],
    }));

    try {
      const response = await axiosInstance.post("/chat", {
        currentConversation: [
          ...currentConversation,
          { content: userMessage, role: "user" },
        ],
      });

      const aiReply = response.data.reply;

      // Check if AI wants to move to the next question
      if (aiReply.includes("<<NEXT_QUESTION>>")) {
        const beforeNEXT_QUESTION = aiReply.split("<<NEXT_QUESTION>>");
        set((state) => ({
          currentConversation: [
            ...state.currentConversation,
            { content: beforeNEXT_QUESTION, role: "assistant" },
          ],
        }));

        set({ enableNextQuestion: true });

        // const nextQuestion =
        //   aiReply.split("<<NEXT_QUESTION>>")[1]?.trim() ||
        //   "Here's your next question:";
        // set({ currentQuestion: nextQuestion });
      } else {
        set((state) => ({
          currentConversation: [
            ...state.currentConversation,
            { content: aiReply, role: "assistant" },
          ],
        }));
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      set({ generatingResponse: false });
    }
  },
}));

export default useInterviewStore;
