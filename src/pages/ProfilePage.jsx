import { useState } from "react";
import PersonalInfo from "../components/profilePage/PersonalInfo";

const ProfilePage = () => {

  const [candidateData] = useState({
      personalInfo: {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/janedoe"
      },
      resume: {
        atsScore: 85,
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Data Analysis"],
        experience: [
          {
            title: "Senior Frontend Developer",
            company: "Tech Solutions Inc.",
            duration: "2020 - Present",
            description: "Led development of responsive web applications using React and Redux."
          },
          {
            title: "Web Developer",
            company: "Digital Creations LLC",
            duration: "2017 - 2020",
            description: "Developed and maintained client websites and e-commerce platforms."
          }
        ],
        education: [
          {
            degree: "Master of Computer Science",
            institution: "University of Technology",
            year: "2017"
          },
          {
            degree: "Bachelor of Science in Information Technology",
            institution: "State University",
            year: "2015"
          }
        ]
      },
      mockInterviews: [
        { id: 1, date: "2025-03-10", score: 72, position: "Frontend Developer" },
        { id: 2, date: "2025-03-15", score: 78, position: "Frontend Developer" },
        { id: 3, date: "2025-03-20", score: 85, position: "Senior Developer" },
        { id: 4, date: "2025-03-25", score: 89, position: "Senior Developer" }
      ]
    });

  return (
    <div className="w-full p-4">
      <PersonalInfo
                    personalInfo={candidateData.personalInfo} 
                    atsScore={candidateData.resume.atsScore} 
                  />
    </div>
  );
};

export default ProfilePage;
