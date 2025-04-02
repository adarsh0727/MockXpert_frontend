import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import React from 'react';
import { Send, ChevronRight, Mic, MicOff, Bookmark} from 'lucide-react';  
const AnswerCard = ({ 
    isSubmitted, 
    currentAnswer, 
    setCurrentAnswer, 
    isRecording, 
    toggleRecording, 
    handleSubmit, 
    handleNextQuestion, 
    textareaRef 
  }) => (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-800">Your Response:</CardTitle>
        <div className="flex space-x-1">
          {!isSubmitted ? (
            <Button 
              onClick={toggleRecording}
              variant="default"
              size="sm"
              className={isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              {isRecording ? <MicOff size={16} className="mr-1" /> : <Mic size={16} className="mr-1" />}
              <span className="hidden sm:inline">{isRecording ? 'Stop' : 'Record'}</span>
            </Button>
          ) : (
            <Button 
              onClick={() => alert('Response bookmarked!')}
              variant="secondary"
              size="sm"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              <Bookmark size={16} className="mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="bg-gray-100 p-4 rounded-lg min-h-40 border">
            <p className="text-gray-700 whitespace-pre-wrap">{currentAnswer}</p>
          </div>
        ) : (
          <Textarea 
            ref={textareaRef}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="bg-gray-50 text-gray-700 border-gray-300 min-h-40 focus:ring-blue-500"
            placeholder="Type your answer here..."
            rows={8}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isSubmitted ? (
          <Button 
            onClick={handleNextQuestion}
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <span>Next Question</span>
            <ChevronRight size={18} className="ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={!currentAnswer.trim()}
            variant="default"
            className={currentAnswer.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          >
            <span>Submit</span>
            <Send size={18} className="ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
export default AnswerCard ; 