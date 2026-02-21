import { useState, useMemo, useEffect } from "react";
import { Plus, Database, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopicSidebar from "@/components/TopicSidebar";
import EntryCard from "@/components/EntryCard";
import AddEntryForm from "@/components/AddEntryForm";
import initialData from "@/data/data.json";
import type { DataEntry } from "@/types/data";

const Index = () => {
  const [data, setData] = useState<DataEntry[]>(initialData as DataEntry[]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const topics = useMemo(() => [...new Set(data.map((d) => d.topic))], [data]);

  const entryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      counts[d.topic] = (counts[d.topic] || 0) + 1;
    });
    return counts;
  }, [data]);

  const filteredEntries = activeTopic ? data.filter((d) => d.topic === activeTopic) : data;

  const handleAdd = (entry: DataEntry) => {
    setData((prev) => [...prev, entry]);
    setShowForm(false);
    setActiveTopic(entry.topic);
  };

  const handleSelectTopic = (topic: string) => {
    setActiveTopic(activeTopic === topic ? null : topic);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Database className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-foreground">Knowledge Base</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Add Entry</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 border-r p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Topics
          </p>
          <TopicSidebar
            topics={topics}
            activeTopic={activeTopic}
            onSelectTopic={handleSelectTopic}
            entryCounts={entryCounts}
          />
          {activeTopic && (
            <button
              onClick={() => setActiveTopic(null)}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground px-3 underline underline-offset-2"
            >
              Show all
            </button>
          )}
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-20 lg:hidden">
            <div className="absolute inset-0 bg-foreground/20" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative w-72 h-full bg-card border-r p-4 pt-6 overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Topics
              </p>
              <TopicSidebar
                topics={topics}
                activeTopic={activeTopic}
                onSelectTopic={handleSelectTopic}
                entryCounts={entryCounts}
              />
              {activeTopic && (
                <button
                  onClick={() => { setActiveTopic(null); setMobileMenuOpen(false); }}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground px-3 underline underline-offset-2"
                >
                  Show all
                </button>
              )}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {showForm && (
            <div className="mb-6 max-w-2xl">
              <AddEntryForm
                existingTopics={topics}
                onAdd={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {activeTopic || "All Topics"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
            </p>
          </div>

          <div className="grid gap-4 max-w-3xl">
            {filteredEntries.map((entry, i) => (
              <EntryCard key={`${entry.topic}-${entry.subtopic}-${i}`} entry={entry} />
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Database className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No entries yet. Add one to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
