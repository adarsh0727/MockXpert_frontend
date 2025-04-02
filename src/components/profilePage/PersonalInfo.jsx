import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Linkedin, Phone } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/button";

const PersonalInfo = ({ personalInfo, atsScore }) => {
  const { authUser } = useAuthStore();
  console.log(authUser);

  function handleResume() {}

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={authUser.profilePic} />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{authUser.username}</h4>
                <p className="text-md">{authUser.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button>upload photo</Button>
              <Button>upload resume</Button>
              <Button onClick={() => window.open(authUser.resumeUrl, "_blank")}>
                view resume
              </Button>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Card className="bg-blue-50">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-700">
                  ATS Score
                </h2>
                <div className="flex items-center">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="4"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={
                          atsScore > 80
                            ? "#48bb78"
                            : atsScore > 60
                              ? "#f6ad55"
                              : "#f56565"
                        }
                        strokeWidth="4"
                        strokeDasharray={`${atsScore}, 100`}
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-xl font-bold">{atsScore}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">
                      Resume strength is{" "}
                      {atsScore >= 80
                        ? "excellent"
                        : atsScore >= 70
                          ? "good"
                          : atsScore >= 60
                            ? "average"
                            : "needs improvement"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
