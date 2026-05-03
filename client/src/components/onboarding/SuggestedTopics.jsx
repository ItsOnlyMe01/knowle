import React, { useState } from "react";
import Button from "../Button";

const TopicPill = ({ topic, isSelected, onToggle }) => (
  <button
    onClick={() => onToggle(topic._id)}
    className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
      isSelected ? "bg-primary text-white" : "bg-surface text-textPrimary"
    }`}
  >
    {topic.name}
  </button>
);

const SuggestedTopics = ({ suggestions, onFinish }) => {
  const safeTeach = Array.isArray(suggestions?.teach) ? suggestions.teach : [];
  const safeLearn = Array.isArray(suggestions?.learn) ? suggestions.learn : [];

  const [selectedTeach, setSelectedTeach] = useState(
    safeTeach.map((t) => t._id),
  );
  const [selectedLearn, setSelectedLearn] = useState(
    safeLearn.map((t) => t._id),
  );
  const [loading, setLoading] = useState(false);

  const toggleTopic = (topicId, type) => {
    const [selected, setSelected] =
      type === "teach"
        ? [selectedTeach, setSelectedTeach]
        : [selectedLearn, setSelectedLearn];

    const newSelection = selected.includes(topicId)
      ? selected.filter((id) => id !== topicId)
      : [...selected, topicId];

    setSelected(newSelection);
  };

  const handleFinishClick = () => {
    setLoading(true);
    onFinish({
      topicsToTeach: selectedTeach,
      topicsToLearn: selectedLearn,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">
        Here are your AI-powered skill suggestions!
      </h2>

      <p className="text-textSecondary text-center mb-8">
        Feel free to adjust these before finishing your setup.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-primary mb-4">
            Skills We Suggest You Teach
          </h3>

          {safeTeach.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {safeTeach.map((topic) => (
                <TopicPill
                  key={topic._id}
                  topic={topic}
                  isSelected={selectedTeach.includes(topic._id)}
                  onToggle={(id) => toggleTopic(id, "teach")}
                />
              ))}
            </div>
          ) : (
            <p>No teaching suggestions yet.</p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-secondary mb-4">
            Skills We Suggest You Learn
          </h3>

          {safeLearn.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {safeLearn.map((topic) => (
                <TopicPill
                  key={topic._id}
                  topic={topic}
                  isSelected={selectedLearn.includes(topic._id)}
                  onToggle={(id) => toggleTopic(id, "learn")}
                />
              ))}
            </div>
          ) : (
            <p>No learning suggestions yet.</p>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <Button onClick={handleFinishClick} disabled={loading}>
          {loading ? "Saving..." : "Finish Setup"}
        </Button>
      </div>
    </div>
  );
};

export default SuggestedTopics;
