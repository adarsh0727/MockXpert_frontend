import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TextareaWithButton } from "../components/InterviewPage/TextInput";
import ChatInterface from "../components/InterviewPage/ChatInterface";

const NewIntPage = () => {
  return (
    <div className="h-screen">
      <div className="h-10 bg-gray-100 text-center justify-center">navbar</div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ChatInterface />
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
