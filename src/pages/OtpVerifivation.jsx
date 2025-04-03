import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "../lib/axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmailStore } from "../store/useEmailStore";
// import { log } from "console";

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const otpSchema = z.object({
  otp: z.string().length(4, { message: "OTP must be 4 digits long" }),
});



const OtpVerificationPage = () => {
  const { otpSent , sendOTP , reSendOTP , verifyOTP } = useEmailStore();
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const handleVerifyOTP = async(data)=>{
    await verifyOTP( data , navigate);
  }
  const resetTimer = ()=>{

    setTimer(30);
    const interval = setInterval(() => {
        setTimer((prev) => {
            if (prev === 1) clearInterval(interval);
            return prev - 1;
        });
    }, 1000);
  }
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });


  return (
    <div className="h-screen flex flex-col gap-16 justify-center items-center bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
      <div className="text-4xl font-bold">OTP Verification</div>
      <Tabs defaultValue="email" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="otp" disabled={!otpSent}>OTP</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Card>
            <CardContent className="space-y-2">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(sendOTP)} className="space-y-8">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your email to receive the OTP.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" onClick={resetTimer} >
                    Send OTP
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="otp">
          <Card>
            <CardContent className="space-y-2">
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-8">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter OTP" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the 4-digit OTP sent to your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Verify OTP
                  </Button>
                  <div className="text-center mt-2">
                    {timer > 0 ? (
                      <span className="text-sm text-gray-300">Resend OTP in {timer}s</span>
                    ) : (
                      <button onClick={()=>{reSendOTP(),resetTimer()}} className="text-sm text-blue-300 hover:underline">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OtpVerificationPage;
