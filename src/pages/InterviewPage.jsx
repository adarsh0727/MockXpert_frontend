import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResizablePanelGroup } from "@/components/ui/resizable";
import ConversationPanel from '../components/interviewPage/ConservationPanel';
import ResponsePanel from '../components/interviewPage/ResponsePanel';
import InterviewHeader from '../components/interviewPage/InterviewHeader';
import { useInterviewStore } from "../store/useInterviewStore";


const InterviewPage = () => {
  const [defaultLayout, setDefaultLayout] = useState([50, 50]);
  const navigate = useNavigate();
  const {
    nextQuestionReady,
    interviewShouldEnd,
    generateNewQuestion,
    generatingResponse,
    endInterview,
  } = useInterviewStore();

  const time = new Date();
  time.setSeconds(time.getSeconds() + 15);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  return (
    <div className="h-screen flex flex-col bg-background">
      <InterviewHeader 
        generateNewQuestion={generateNewQuestion}
        endInterview={endInterview}
        nextQuestionReady={nextQuestionReady}
        interviewShouldEnd={interviewShouldEnd}
      />
      
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
        onLayout={(sizes) => setDefaultLayout(sizes)}
      >
        <ConversationPanel 
          defaultSize={defaultLayout[0]}
          generatingResponse={generatingResponse}
        />
        
        <ResponsePanel 
          defaultSize={defaultLayout[1]} 
        />
      </ResizablePanelGroup>
    </div>
  );
};

export default InterviewPage;