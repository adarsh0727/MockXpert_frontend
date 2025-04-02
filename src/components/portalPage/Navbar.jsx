import React, { useEffect, useState } from "react";
import { Menu, Clock, PauseCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Navbar = ({  currentQuestionIndex, totalQuestions }) => {
  const [timer, setTimer] = useState(180);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  return (
    <div className="bg-white shadow-sm p-3 flex items-center justify-between sticky top-0 z-10 border-b">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((prev) => !prev)} className="lg:hidden">
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-gray-800">Mock Interview</h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* User Profile */}
        

        {/* Timer */}
        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-700 flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{formatTime(timer)}</span>
        </Badge>

        {/* Pause/Resume */}
        <Button variant="ghost" size="icon" onClick={() => setIsRunning((prev) => !prev)}>
          {isRunning ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
        </Button>

        {/* Progress */}
        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-700">
          {currentQuestionIndex + 1} / {totalQuestions}
        </Badge>
        <Card className="hidden sm:flex items-center p-2 bg-gray-100 border">
          <CardContent className="flex items-center gap-2 p-2">
            <Avatar className="h-6 w-6 bg-black">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-600">Software Dev</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Navbar;
