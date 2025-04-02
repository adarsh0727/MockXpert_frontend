import React from "react";
import { marked } from "marked"; // Markdown parser
import DOMPurify from "dompurify"; // Prevent XSS attacks
import { CheckCircle, Award } from "lucide-react";

const FeedbackCard = ({ feedback }) => {
  // Generate markdown string dynamically
  const markdownContent = `
# AI Feedback

**Score:** \`${feedback.score}/100\`

---

##  Strengths
${feedback.strengths.map((strength) => `- ${strength}`).join("\n")}

---

##  Areas for Improvement
${feedback.improvements.map((improvement) => `- ${improvement}`).join("\n")}

---

##  Response Analysis
> Your answer demonstrates **good communication skills** and provides relevant context.  
> Consider adding more **specific examples with quantifiable results** to strengthen your response.  
> Try to structure your answer using the **STAR method** for clarity and impact.
  `;

  // Convert Markdown to HTML
  const htmlContent = DOMPurify.sanitize(marked(markdownContent));

  return (
    <div className="bg-white border shadow-sm rounded-lg p-6 mt-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-xl font-semibold">AI Feedback:</h2>
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md text-sm">
          <Award size={16} className="text-yellow-500" />
          <span>Score: {feedback.score}/100</span>
        </div>
      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="text-green-700 flex items-center font-semibold text-md">
            <CheckCircle size={18} className="mr-2" /> Strengths
          </h3>
          <ul className="text-gray-700 mt-2 space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="text-yellow-700 flex items-center font-semibold text-md">
            <CheckCircle size={18} className="mr-2" /> Areas for Improvement
          </h3>
          <ul className="text-gray-700 mt-2 space-y-2">
            {feedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle size={16} className="text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Response Analysis */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
        <h3 className="text-blue-700 font-semibold text-md">Response Analysis:</h3>
        <p className="text-gray-700 text-sm mt-1">
          Your answer demonstrates <strong>good communication skills</strong> and provides relevant context.  
          Consider adding more <strong>specific examples with quantifiable results</strong> to strengthen your response.  
          Try to structure your answer using the <strong>STAR method</strong> for clarity and impact.
        </p>
      </div>
    </div>
  );
};

export default FeedbackCard;
