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

  allConversations: [],
  currentConversation: [],

  isLoading: false,

  setFormData: async (data) => {
    set({ isLoading: true });

    const { generateNewQuestion } = get();

    const response = await axiosInstance.post("/interview", data);

    set((state) => ({
      formData: { ...state.formData, ...data },
      interviewId: response.data.interviewId,
    }));

    generateNewQuestion();

    set({ isLoading: false });
  },

  generateNewQuestion: async () => {
    set({ isLoading: true, enableNextQuestion: false });

    const { formData, currentConversation } = get();

    set((state) => ({
      allConversations: [...state.allConversations, currentConversation],
    }));

    const {
      role: jobRole,
      company: targetCompany,
      prefferedLanguage: preferredLanguage,
      experience: yearsOfExperience,
      codingRound,
    } = formData;

    console.log(jobRole, targetCompany);

    const systemMessage = {
      role: "system",
      content: `
    You are a senior technical interviewer conducting mock interviews for the role of ${jobRole} at ${targetCompany}. 
    Ask one interview question at a time. Wait for the candidate's answer before asking follow-ups.
    After the candidate answers, analyze their response and determine if:
    - Follow-up questions are needed to go deeper on weak parts, or
    - The answer is sufficient and you can proceed to the next question.
    
    Never ask the next question until the candidate is done with the previous one.
    When the candidate gives a strong answer, ask: "Great. Would you like to proceed to the next question?"
    `
    };

    const userMessage = {
      role: "user",
      content: codingRound
        ? `Generate a medium-level technical question for a ${jobRole} role at ${targetCompany}, considering ${yearsOfExperience} years of experience and ${preferredLanguage}.`
        : `Generate a theoretical manegerial question for a ${jobRole} position at ${targetCompany} with ${yearsOfExperience} years of experience.`,
    };

    const initialMessages = [systemMessage, userMessage];

    const response = await axiosInstance.post("/chat", {
      messages: initialMessages,
    });

    // Append assistant reply to full conversation
    const updatedConversation = [
      ...initialMessages,
      { content: response.data.reply, role: "assistant" },
    ];

    set({ currentConversation: updatedConversation, isLoading: false });
  },

  sendMessage: async (event) => {
    event.preventDefault();
    set({ generatingResponse: true });
  
    const userMessage = event.target.querySelector("textarea").value;
    const { currentConversation } = get();
  
    // ✅ Ensure a system message exists
    const hasSystemMessage = currentConversation.some(
      (msg) => msg.role === "system" || msg.role === "developer"
    );
  
    const systemMessage = {
      role: "assistant",
      content: "You're an experienced technical interviewer. Ask thoughtful, contextual questions based on the chat history.",
    };
  
    const updatedConversation = [
      ...(hasSystemMessage ? [] : [systemMessage]),
      ...currentConversation,
      { role: "user", content: userMessage },
    ];
  
    // ✅ Debug log
    console.log("📤 [Frontend] Sending to /chat API:");
    console.log(JSON.stringify({ messages: updatedConversation }, null, 2));
  
    set({ currentConversation: updatedConversation });
  
    try {
      const response = await axiosInstance.post("/chat", {
        messages: updatedConversation,
      });
  
      const assistantMessage = {
        role: "assistant",
        content: response.data.reply,
      };
  
      set((state) => ({
        currentConversation: [...state.currentConversation, assistantMessage],
      }));
    } catch (error) {
      console.error("❌ [Frontend] Error fetching AI response:", error?.response?.data || error.message);
    } finally {
      set({ generatingResponse: false });
    }
  },
}));

export default useInterviewStore;