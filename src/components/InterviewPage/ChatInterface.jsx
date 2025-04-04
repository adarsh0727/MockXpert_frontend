import { ScrollArea } from "@/components/ui/scroll-area";
import useInterviewStore from "../../store/useInterviewStore";

const ChatInterface = () => {
  // Initial messages array
  const { currentConversation } = useInterviewStore();

  return (
    <div className="flex flex-col h-screen w-full mx-auto p-4">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {currentConversation.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-xs ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatInterface;
