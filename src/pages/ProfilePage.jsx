import { useState } from "react";
import PersonalInfo from "../components/profilePage/PersonalInfo";
import InterviewStats from "../components/profilePage/InterviewStats";
const ProfilePage = () => {
  const [candidateData] = useState({
    personalInfo: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/janedoe",
    },
    resume: {
      atsScore: 85,
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "SQL",
        "Data Analysis",
      ],
      experience: [
        {
          title: "Senior Frontend Developer",
          company: "Tech Solutions Inc.",
          duration: "2020 - Present",
          description:
            "Led development of responsive web applications using React and Redux.",
        },
        {
          title: "Web Developer",
          company: "Digital Creations LLC",
          duration: "2017 - 2020",
          description:
            "Developed and maintained client websites and e-commerce platforms.",
        },
      ],
      education: [
        {
          degree: "Master of Computer Science",
          institution: "University of Technology",
          year: "2017",
        },
        {
          degree: "Bachelor of Science in Information Technology",
          institution: "State University",
          year: "2015",
        },
      ],
    },
    mockInterviews: [
      {
        id: 1,
        sno: 1,
        company: "Google",
        jobRole: "Frontend Developer",
        score: 72,
        date: "2025-03-10",
        time: "10:30 AM",
        actions: "View Report",
      },
      {
        id: 2,
        sno: 2,
        company: "Microsoft",
        jobRole: "Frontend Developer",
        score: 78,
        date: "2025-03-15",
        time: "02:00 PM",
        actions: "View Report",
      },
      {
        id: 3,
        sno: 3,
        company: "Amazon",
        jobRole: "Senior Developer",
        score: 85,
        date: "2025-03-20",
        time: "11:45 AM",
        actions: "View Report",
      },
      {
        id: 4,
        sno: 4,
        company: "Meta",
        jobRole: "Senior Developer",
        score: 89,
        date: "2025-03-25",
        time: "04:15 PM",
        actions: "View Report",
      },
    ],
  });

  return (
    <div className="w-full p-4">
      <PersonalInfo atsScore={candidateData.resume.atsScore} />
      <InterviewStats interviews={candidateData.mockInterviews} />
    </div>
  );
};

export default ProfilePage;
