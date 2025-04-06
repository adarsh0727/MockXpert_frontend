import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


const detectEndIntent = (message) => {
  const lower = message.toLowerCase();
  const endPhrases = [
    "thank you for participating",
    "that concludes our mock interview",
    "good luck",
    "if you have any feedback",
    "feel free to reach out",
    "wish you all the best",
    "great talking with you",
    "all the best",
    "end of the interview",
    "Thank you for sharing your insights and experiences with me today.",
    "wrap up"
  ];
  return endPhrases.some((phrase) => lower.includes(phrase));
};

export const useInterviewStore = create((set, get) => ({

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
  currentCoversationIndex: 0,
  interviews: [],

  setFormData: async (data) => {
    set({ isLoading: true });

    const { startInterview } = get();

    try {
        console.log("Sending data:", data);
        const response = await axiosInstance.post("/interview/", data);
        console.log("Response received:", response.data);
  
        set((state) => {
          const updatedFormData = { ...state.formData, ...data };
          console.log("Updated formData state:", updatedFormData);
          return {
            formData: updatedFormData,
            interviewId: response.data.interviewId,
          };
        });
  
        toast.success("Form submitted successfully!");
        startInterview();
        set({ isLoading: false });
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit form. Please try again.");
      }
    },

  startInterview: async () => {
    set({ isLoading: true, nextQuestionReady: false, conversation: [] });

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
Start your interview with a warm greeting. Ask one question at a time, wait for answers.
Use <<NEXT_QUESTION>> to indicate readiness for the next.
Use <<END_INTERVIEW>> to end the interview.
      `.trim(),
    };

    const userMessage = {
      role: "user",
      content: codingRound
        ? `Generate a technical question for a ${jobRole} role at ${targetCompany} using ${preferredLanguage}, experience: ${yearsOfExperience} years.`
        : `Generate a theoretical/behavioral question for a ${jobRole} role at ${targetCompany}, with ${yearsOfExperience} years of experience.`,
    };

    const initialMessages = [systemMessage, userMessage];
    const response = await axiosInstance.post("/chat", { messages: initialMessages });

    const updatedConversation = [
      ...initialMessages,
      { role: "assistant", content: response.data.reply },
    ];

    set({
      conversation: updatedConversation,
      currentCoversationIndex: 2,
      isLoading: false,
    });
  },

  sendMessage: async (event) => {
    // event.preventDefault();
    if (!event || event.trim() === "") return;
    set({ generatingResponse: true });

    const userMessage = event.trim();
    const { conversation } = get();

    const hasSystemMessage = conversation.some(
      (msg) => msg.role === "system" || msg.role === "developer",
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
        error?.response?.data || error.message,
      );
    } finally {
      set({ generatingResponse: false });
    }
  },

  generateNewQuestion: async () => {
    set({
      isLoading: true,
      nextQuestionReady: false,
      interviewShouldEnd: false,
    });

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
      currentCoversationIndex: state.conversation.length + 1,
      conversation: [...state.conversation, userMessage, assistantMessage],
      isLoading: false,
      nextQuestionReady: false,
      interviewShouldEnd: false,
    }));
  },

  endInterview: async () => {
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
    } catch (error) {
      console.error(
        "❌ Failed to generate analysis:",
        error?.response?.data || error.message,
      );
    }
  },
  interviews: [],
  isLoading: false,
  fetchUserInterviews: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/interview');
      set({ interviews: res.data });
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));