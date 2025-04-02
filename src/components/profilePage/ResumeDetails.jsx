import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ResumeDetails = ({ skills, experience, education }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <p className="font-medium">{exp.title}</p>
                <p className="text-gray-600 text-sm">{exp.duration}</p>
              </div>
              <p className="text-gray-700">{exp.company}</p>
              <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">{edu.degree}</p>
              <div className="flex justify-between">
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-gray-600 text-sm">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeDetails;