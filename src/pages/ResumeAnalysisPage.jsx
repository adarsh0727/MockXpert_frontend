// src/pages/ResumeAnalysisPage.jsx
import React, { useState } from 'react';
import UploadZone from '../components/ResumeAnalyser/UploadZone';
import AnalysisStatus from '../components/ResumeAnalyser/AnalysisStatus';
import ResultTabs from '../components/ResumeAnalyser/ResultTabs';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [_, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { updateScore } = useAuthStore();

  // Mock analysis results
  const [analysisResults, setAnalysisResults] = useState({
    score: 0,
    strengths: [],
    improvements: [],
    keywords: [],
    sections: {},
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
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setIsUploaded(true);
        analyzeResume(selectedFile);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const analyzeResume = async (file) => {
    setIsAnalyzing(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append('resume', file);
  
      // 1. Upload Resume
      const uploadRes = await axiosInstance.put('/resume/upload-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resumeUrl = uploadRes.data.resumeUrl;
  
      // 2. Get ATS Score
      const atsRes = await axiosInstance.post(
        '/resume/ats-score',
        { resumeUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const score = parseInt(atsRes.data.atsScore, 10);
      updateScore({ atsScore: score });
  
      // 3. Get Feedback
      const feedbackRes = await axiosInstance.post(
        '/resume/resume-feedback',
        { resumeUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const feedbackText = feedbackRes.data.feedback;
      const strengths = [];
      const improvements = [];
      const lines = feedbackText.split('\n');
      let currentSection = '';
  
      for (let line of lines) {
        line = line.trim();
        if (line.toLowerCase().startsWith('strength')) {
          currentSection = 'strengths';
          continue;
        } else if (line.toLowerCase().startsWith("improvement")) {
          currentSection = "improvements";
          continue;
        }
  
        const match = line.match(/^\d+[\.\)]\s+(.*)/);
        if (match) {
          const item = match[1].trim();
          if (currentSection === "strengths") strengths.push(item);
          if (currentSection === "improvements") improvements.push(item);
        }
      }
  
      // 4. Get Improvement Tips
      const tipsRes = await axiosInstance.post(
        '/resume/resume-improvement-tips',
        { resumeUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const keywords = [];
      const tipsLines = tipsRes.data.improvementTips.split('\n');
      for (let line of tipsLines) {
        const match = line.trim().match(/^\d+[\.\)]\s+(.*)/);
        if (match) {
          keywords.push(match[1].trim());
        }
      }
  
      // 5. Update UI
      setAnalysisResults((prev) => ({
        ...prev,
        score,
        strengths,
        improvements,
        keywords,
      }));
      setAnalysisComplete(true);
    } catch (err) {
      console.error('❌ Error:', err);
      alert(err.response?.data?.message || 'Something went wrong. Please try again.');
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
      sections: {},
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
