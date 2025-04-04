import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TextareaWithButton } from "../components/InterviewPage/TextInput";
import ChatInterface from "../components/InterviewPage/ChatInterface";
import { Button } from "../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, CircleX } from "lucide-react";

const NewIntPage = () => {
  return (
    <div className="h-screen">
      <div className="p-2 flex gap-4 text-center justify-end bg-accent">
        <Button>
          next question
          <ChevronRight />
        </Button>
        <Button>
          end interview
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
