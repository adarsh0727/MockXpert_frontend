import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const useEmailStore = create((set, get) => ({
  userEmail: "",
  otpSent: false,

  setUserEmail: (email) => set({ userEmail: email }),

  sendOTP: async (data) => {
    try {
      const res = await axiosInstance.post("/reset/sendotp", data);
      toast("OTP sent to email successfully");

      get().setUserEmail(data.email); 
      set({ otpSent: true });

      console.log(get().userEmail); 
    } catch (error) {
      console.log(error);
      toast({ title: error.response.data.error, variant: "destructive" });
    }
  },

  reSendOTP: async () => {
    const userEmail = get().userEmail; 
    if (!userEmail) {
      console.log("No email found for resending OTP");
      return;
    }

    try {
      await axiosInstance.post("/reset/sendotp", { email: userEmail });
      console.log("OTP resent");
      toast("OTP resent successfully");
    } catch (error) {
      console.log(error);
      // toast({ title: error.response.data.error, variant: "destructive" });
    }
  },

  verifyOTP: async (data,navigate) => {
    const email = get().userEmail; 
    const otp = Number(data.otp);

    if (!email) {
      console.log("No email found for verification");
      return;
    }

    try {
      await axiosInstance.post("/reset/verifyotp", { email, otp });
      toast("OTP verification successful");
      navigate("/reset-password");
    } catch (error) {
      console.log(error);
      toast("OTP verification failed");
    }
  },
  resetPassword: async (data,navigate) => {
    const email = get().userEmail; 
    const password = data.newPassword;
    try {
        await axiosInstance.post("/reset/updatepass", { email, password });
        toast("Password updated successfully");
        navigate("/get-started");
      } catch (error) {
        console.log(error);
        toast("update failed");
      }

  }
}));
