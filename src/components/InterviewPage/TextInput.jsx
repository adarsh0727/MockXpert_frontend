import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useInterviewStore from "../../store/useInterviewStore";

export function TextareaWithButton() {
  const { sendMessage, generatingResponse } = useInterviewStore();

  return (
    <div className="flex flex-col m-8 items-end">
      <form onSubmit={sendMessage}>
        <Textarea
          placeholder="Type your message here."
          className="mb-4"
          rows="40"
        />
        <Button type="submit" disabled={generatingResponse}>
          Send
        </Button>
      </form>
    </div>
  );
}
