import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
const detectEndIntent = (message) => {
  const lower = message.toLowerCase();

  const endPhrases = [
    "thank you for participating",
    "Thank you for participating in the mock interview",
    "that concludes our mock interview",
    "Good Luck",
    "if you have any feedback",
    "feel free to reach out",
    "wish you all the best",
    "great talking with you",
    "all the best",
    "end of the interview",
  ];

  return endPhrases.some((phrase) => lower.includes(phrase));
};
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
  nextQuestionReady: false,
  analysisReport: null,
  interviewShouldEnd: false,
  generatingResponse: false,
  isLoading: false,

  conversation: [],

  setFormData: async (data) => {
    set({ isLoading: true });

    const { startInterview } = get();

    const response = await axiosInstance.post("/interview", data);

    set((state) => ({
      formData: { ...state.formData, ...data },
      interviewId: response.data.interviewId,
    }));

    startInterview();

    set({ isLoading: false });
  },

  startInterview: async () => {
    set({ isLoading: true, nextQuestionReady: false });

    const { formData } = get();

    const {
      role: jobRole,
      company: targetCompany,
      prefferedLanguage: preferredLanguage,
      experience: yearsOfExperience,
      codingRound,
    } = formData;

    const systemMessage = {
      role: "system",
      content: `
You are a senior technical interviewer conducting mock interviews for the role of ${jobRole} at ${targetCompany}.
Ask one interview question at a time. Wait for the candidate's answer before asking follow-ups.
After the candidate answers, analyze their response and determine if:
- Follow-up questions are needed to go deeper on weak parts, or
- The answer is sufficient and you can proceed to the next question.

✅ When ready to move on, append: <<NEXT_QUESTION>>
🛑 To end the interview, append: <<END_INTERVIEW>>

Do not say these tokens aloud. Use them only at the end of your message for system logic.
      `,
    };

    const userMessage = {
      role: "user",
      content: codingRound
        ? `Generate a medium-level technical question for a ${jobRole} role at ${targetCompany}, considering ${yearsOfExperience} years of experience and ${preferredLanguage}.`
        : `Generate a theoretical managerial question for a ${jobRole} position at ${targetCompany} with ${yearsOfExperience} years of experience.`,
    };

    const initialMessages = [systemMessage, userMessage];

    const response = await axiosInstance.post("/chat", {
      messages: initialMessages,
    });

    const updatedConversation = [
      ...initialMessages,
      { content: response.data.reply, role: "assistant" },
    ];

    set({ conversation: updatedConversation, isLoading: false });
  },
  
  sendMessage: async (event) => {
    event.preventDefault();
    set({ generatingResponse: true });

    const userMessage = event.target.querySelector("textarea").value;
    const { conversation } = get();

    const hasSystemMessage = conversation.some(
      (msg) => msg.role === "system" || msg.role === "developer"
    );

    const systemMessage = {
      role: "system",
      content:
        "You're an experienced technical interviewer. Ask thoughtful, contextual questions based on the chat history.",
    };

    const updatedConversation = [
      ...(hasSystemMessage ? [] : [systemMessage]),
      ...conversation,
      { role: "user", content: userMessage },
    ];

    console.log("📤 [Frontend] Sending to /chat API:");
    console.log(JSON.stringify({ messages: updatedConversation }, null, 2));

    set({ conversation: updatedConversation });

    try {
      const response = await axiosInstance.post("/chat", {
        messages: updatedConversation,
      });

      const rawReply = response.data.reply;

      const nextQuestionReady = rawReply.includes("<<NEXT_QUESTION>>");
      const explicitEnd = rawReply.includes("<<END_INTERVIEW>>");
      const implicitEnd = detectEndIntent(rawReply);
      const interviewShouldEnd = explicitEnd || implicitEnd;

      const cleanedReply = rawReply
        .replace("<<NEXT_QUESTION>>", "")
        .replace("<<END_INTERVIEW>>", "")
        .trim();
      if (interviewShouldEnd) {
        const { endInterview } = get();
        endInterview();
      }

      const assistantMessage = {
        role: "assistant",
        content: cleanedReply,
      };

      set((state) => ({
        conversation: [...state.conversation, assistantMessage],
        nextQuestionReady,
        interviewShouldEnd,
      }));
    } catch (error) {
      console.error(
        "❌ [Frontend] Error fetching AI response:",
        error?.response?.data || error.message
      );
    } finally {
      set({ generatingResponse: false });
    }
  },

  generateNewQuestion: async () => {
    set({ isLoading: true, nextQuestionReady: false, interviewShouldEnd: false });

    const { formData, conversation } = get();

    const {
      role: jobRole,
      company: targetCompany,
      prefferedLanguage: preferredLanguage,
      experience: yearsOfExperience,
      codingRound,
    } = formData;

    const userMessage = {
      role: "user",
      content: codingRound
        ? `Ask a new technical question on a different topic for a ${jobRole} role at ${targetCompany}, considering ${yearsOfExperience} years of experience in ${preferredLanguage}.`
        : `Ask a new theoretical/managerial question on a different topic for a ${jobRole} role at ${targetCompany}, with ${yearsOfExperience} years of experience.`,
    };

    const updatedConversation = [...conversation, userMessage];

    const response = await axiosInstance.post("/chat", {
      messages: updatedConversation,
    });

    const rawReply = response.data.reply;

    const cleanedReply = rawReply
      .replace("<<NEXT_QUESTION>>", "")
      .replace("<<END_INTERVIEW>>", "")
      .trim();

    const assistantMessage = {
      role: "assistant",
      content: cleanedReply,
    };

    set((state) => ({
      conversation: [...state.conversation, userMessage, assistantMessage],
      isLoading: false,
      nextQuestionReady: false,
      interviewShouldEnd: false,
    }));
  },
  endInterview: async (navigate) => {
    const { conversation, interviewId, formData } = get();
  
    // Convert chat messages into formatted feedback string
    const feedback = conversation
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");
  
    try {
      const response = await axiosInstance.post("/portal/analysis", {
        interviewId,
        feedback,
        formData,
      });
  
      console.log("✅ Analysis complete:", response.data);
      const { pdfUrl } = response.data;
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      }
  
      // Optionally: Store report URL or trigger UI updates
      set({ analysisReport: response.data });
      if (navigate) {
        navigate("/profile");
      }
  
    } catch (error) {
      console.error("❌ Failed to generate analysis:", error?.response?.data || error.message);
    }
  },  
}));

export default useInterviewStore;