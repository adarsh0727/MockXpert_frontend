import { Card, CardContent } from "@/components/ui/card";

const PersonalInfo = ({ personalInfo, atsScore }) => {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{personalInfo.name}</h1>
            <div className="mt-2 text-gray-600">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.location}</p>
              <p>LinkedIn: {personalInfo.linkedin}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Card className="bg-blue-50">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-700">ATS Score</h2>
                <div className="flex items-center">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="4"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={atsScore > 80 ? "#48bb78" : atsScore > 60 ? "#f6ad55" : "#f56565"}
                        strokeWidth="4"
                        strokeDasharray={`${atsScore}, 100`}
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-xl font-bold">{atsScore}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">
                      Resume strength is{" "}
                      {atsScore >= 80
                        ? "excellent"
                        : atsScore >= 70
                        ? "good"
                        : atsScore >= 60
                        ? "average"
                        : "needs improvement"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;