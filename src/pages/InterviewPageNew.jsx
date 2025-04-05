import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TextareaWithButton } from "../components/InterviewPage/TextInput";
import ChatInterface from "../components/InterviewPage/ChatInterface";
import useInterviewStore from "../store/useInterviewStore";
import { Button } from "../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";


const NewIntPage = () => {
  const navigate = useNavigate();
  const {
    nextQuestionReady,
    interviewShouldEnd,
    generateNewQuestion, // call this on button click
  } = useInterviewStore();
  return (
    <div className="h-screen">
      <div className="p-2 flex gap-4 text-center justify-end bg-accent">
      <Button
        onClick={generateNewQuestion}
        disabled={!nextQuestionReady}
        variant={nextQuestionReady ? "default" : "outline"}
      >
        Next Question
        <ChevronRight />
      </Button>

      <Button
        onClick={() => endInterview(navigate)}
        disabled={!interviewShouldEnd}
        variant={interviewShouldEnd ? "destructive" : "outline"}
      >
        End Interview
        <CircleX />
      </Button>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ScrollArea className="h-full w-full">
            <ChatInterface />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <TextareaWithButton />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default NewIntPage;
