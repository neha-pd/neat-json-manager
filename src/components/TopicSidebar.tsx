import { Folder, ChevronRight } from "lucide-react";

interface TopicSidebarProps {
  topics: string[];
  activeTopic: string | null;
  onSelectTopic: (topic: string) => void;
  entryCounts: Record<string, number>;
}

const TopicSidebar = ({ topics, activeTopic, onSelectTopic, entryCounts }: TopicSidebarProps) => {
  return (
    <nav className="flex flex-col gap-1">
      {topics.map((topic) => {
        const isActive = activeTopic === topic;
        return (
          <button
            key={topic}
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
        );
      })}
    </nav>
  );
};

export default TopicSidebar;
