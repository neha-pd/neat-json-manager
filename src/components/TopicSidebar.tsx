import { Folder, ChevronRight, FileText } from "lucide-react";

interface TopicSidebarProps {
  topics: string[];
  activeTopic: string | null;
  onSelectTopic: (topic: string) => void;
  entryCounts: Record<string, number>;
  subtopicsByTopic: Record<string, string[]>;
  activeSubtopic: string | null;
  onSelectSubtopic: (subtopic: string) => void;
}

const TopicSidebar = ({
  topics,
  activeTopic,
  onSelectTopic,
  entryCounts,
  subtopicsByTopic,
  activeSubtopic,
  onSelectSubtopic
}: TopicSidebarProps) => {
  return (
    <nav className="flex flex-col gap-1">
      {topics.map((topic) => {
        const isActive = activeTopic === topic;
        const subtopics = subtopicsByTopic[topic] || [];
        
        return (
          <div key={topic}>
            <button
              onClick={() => onSelectTopic(topic)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-left w-full group ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{topic}</span>
              <span
                className={`text-xs tabular-nums ${
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
                }`}
              >
                {entryCounts[topic] || 0}
              </span>
              <ChevronRight
                className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                  isActive ? "rotate-90 text-primary-foreground/70" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                }`}
              />
            </button>
            
            {isActive && subtopics.length > 0 && (
              <div className="ml-4 mt-1 mb-1 flex flex-col gap-0.5">
                {subtopics.map((subtopic) => {
                  const isSubtopicActive = activeSubtopic === subtopic;
                  return (
                    <button
                      key={subtopic}
                      onClick={() => onSelectSubtopic(subtopic)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors text-left w-full ${
                        isSubtopicActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      }`}
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="flex-1 truncate">{subtopic}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default TopicSidebar;
