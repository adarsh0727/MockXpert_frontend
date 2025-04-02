import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import React from 'react';
import { CheckCircle} from 'lucide-react';


const InterviewTips = ({ tips }) => (
    <Alert className="bg-blue-50 border border-blue-200 block rounded-lg p-4 mt-4 shadow-sm">
    <h3 className="text-base font-semibold text-blue-700 mb-2">Interview Tips:</h3>
    <AlertDescription>
      <ul className="space-y-2 text-gray-700">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={18} className="text-green-600 mr-2 flex-shrink-0" />
            <span className="text-sm block">{tip}</span>
          </li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
  
  
  );
  
  // Keywords Component
  const KeywordsList = ({ keywords }) => (
    <Alert className="bg-blue-50 block border-blue-200 mt-4">
      <h3 className="text-sm font-medium text-blue-700 mb-2">Key Concepts to Address:</h3>
      <AlertDescription>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700 border-gray-300">
              {keyword}
            </Badge>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
  
const QuestionCard = ({ question, showTips, setShowTips, showKeywords, setShowKeywords, isTimerActive, setIsTimerActive }) => (
  <Card className="bg-white border shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg text-gray-800">Interviewer AI:</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-700 mb-4">{question.text}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={() => setShowTips(!showTips)}
          variant={showTips ? "default" : "secondary"}
          size="sm"
          className={showTips ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
        >
          {showTips ? 'Hide Tips' : 'Show Tips'}
        </Button>
        <Button 
          onClick={() => setShowKeywords(!showKeywords)}
          variant={showKeywords ? "default" : "secondary"}
          size="sm"
          className={showKeywords ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
        >
          {showKeywords ? 'Hide Keywords' : 'Show Keywords'}
        </Button>
        {/* <Button 
          onClick={() => setIsTimerActive(!isTimerActive)}
          variant="default"
          size="sm"
          className={isTimerActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
        >
          {isTimerActive ? 'Pause Timer' : 'Start Timer'}
        </Button> */}
      </div>
      
      {showTips && <InterviewTips tips={question.tips} />}
      {showKeywords && <KeywordsList keywords={question.keywords} />}
    </CardContent>
  </Card>
);

export default QuestionCard;