import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in  checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    console.log("data in signup:", data);
    try {
      await axiosInstance.post("/user/signup", data);
      toast("Mail Successfully sent");
    } catch (error) {
      toast(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });

    try {
      const res = await axiosInstance.post("/user/login", data);
      set({ authUser: res.data });
      toast("Logged in successfully");
    } catch (error) {
      toast({ title: error.response.data.error, variant: "destructive" });
    } finally {
      set({ isLoggingIng: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast({ title: error.response.data.error, variant: "destructive" });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast({ title: error.response.data.error, variant: "destructive" });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
