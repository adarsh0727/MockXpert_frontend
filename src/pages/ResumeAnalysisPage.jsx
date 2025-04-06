


// src/pages/ResumeAnalysisPage.jsx
import React, { useState } from 'react';
import UploadZone from '../components/ResumeAnalyser/UploadZone';
import AnalysisStatus from '../components/ResumeAnalyser/AnalysisStatus';
import ResultTabs from '../components/ResumeAnalyser/ResultTabs';
import { useAuthStore } from '../store/useAuthStore';

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const {updateScore} = useAuthStore()
  
  // Mock analysis results
  const [analysisResults, setAnalysisResults] = useState({
    score: 0,
    strengths: [],
    improvements: [],
    keywords: [],
    sections: {}
  });
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };
  
  const handleFiles = (files) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setIsUploaded(true);
        analyzeResume(selectedFile);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };
  
  const analyzeResume = async (file) => {
    setIsAnalyzing(true);
    const token = localStorage.getItem('token');
  
    try {
      const formData = new FormData();
      formData.append('resume', file);
  
      const response = await fetch('/api/resume/upload-resume', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload resume');
      }
  
      // console.log('✅ Resume uploaded:', result.resumeUrl);
      const resumeUrl = result.resumeUrl;
      const atsResponse = await fetch('/api/resume/ats-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl }),
      });
  
      const atsData = await atsResponse.json();
      if (!atsResponse.ok) throw new Error(atsData.message);
  
      const score = parseInt(atsData.atsScore, 10);

      // console.log('🎯 ATS Score:', score);
      updateScore({ atsScore: score })

      const feedbackRes = await fetch('/api/resume/resume-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl }),
      });
      
      const feedbackData = await feedbackRes.json();
      if (!feedbackRes.ok) {
        throw new Error(feedbackData.message || 'Failed to fetch resume feedback.');
      }
      
      // console.log('🧠 Raw Feedback:', feedbackData.feedback);
      
      // 4. Parse LLM feedback into usable sections
      const strengths = [];
      const improvements = [];

      const lines = feedbackData.feedback.split('\n');
      let currentSection = '';

      for (let line of lines) {
        line = line.trim();

        if (line.toLowerCase().startsWith('strength')) {
          currentSection = 'strengths';
          continue;
        } else if (line.toLowerCase().startsWith('improvement')) {
          currentSection = 'improvements';
          continue;
        }

        // Check for numbered list: "1. Text..." or "1) Text..."
        const match = line.match(/^\d+[\.\)]\s+(.*)/);
        if (match) {
          const item = match[1].trim();
          if (currentSection === 'strengths') strengths.push(item);
          if (currentSection === 'improvements') improvements.push(item);
        }
      }
      const tipsRes = await fetch('/api/resume/resume-improvement-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl }),
      });
      
      const tipsData = await tipsRes.json();
      if (!tipsRes.ok) {
        throw new Error(tipsData.message || 'Failed to fetch improvement tips.');
      }
      
      // console.log("📌 Improvement Tips:", tipsData.improvementTips);
      
      // 6. Convert numbered tips to keywords array
      const keywords = [];
      const tipsLines = tipsData.improvementTips.split('\n');
      for (let line of tipsLines) {
        const match = line.trim().match(/^\d+[\.\)]\s+(.*)/);
        if (match) {
          keywords.push(match[1].trim());
        }
      }
  
      // 3. Update frontend with the result
      setAnalysisResults((prev) => ({
        ...prev,
        score,
        strengths,
        improvements,
        keywords,
      }));
  
      setAnalysisComplete(true);
  
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Resume upload failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  
  // Reset state for reupload
  const handleReupload = () => {
    setFile(null);
    setIsUploaded(false);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResults({
      score: 0,
      strengths: [],
      improvements: [],
      keywords: [],
      sections: {}
    });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Resume Analyzer</h1>
      
      {!isUploaded ? (
        <UploadZone 
          isDragging={isDragging}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
        />
      ) : (
        <div className="space-y-6">
          <AnalysisStatus 
            file={file}
            analysisComplete={analysisComplete}
            handleReupload={handleReupload}
          />
          
          {analysisComplete && <ResultTabs analysisResults={analysisResults} />}
        </div>
      )}
    </div>
  );
}