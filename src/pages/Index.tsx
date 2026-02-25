import { useState, useMemo, useEffect } from "react";
import { Plus, Database, Menu, X, Sun, Moon, Search, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopicSidebar from "@/components/TopicSidebar";
import EntryCard from "@/components/EntryCard";
import AddEntryForm from "@/components/AddEntryForm";
import initialData from "@/data/data.json";
import type { DataEntry } from "@/types/data";

const Index = () => {
  const [data, setData] = useState<DataEntry[]>(initialData as DataEntry[]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    // Default to dark when no preference is stored
    return stored !== 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const topics = useMemo(() => [...new Set(data.map((d) => d.topic))], [data]);

  const entryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => {
      counts[d.topic] = (counts[d.topic] || 0) + 1;
    });
    return counts;
  }, [data]);

  const subtopicsByTopic = useMemo(() => {
    const subtopics: Record<string, string[]> = {};
    data.forEach((d) => {
      if (!subtopics[d.topic]) {
        subtopics[d.topic] = [];
      }
      if (!subtopics[d.topic].includes(d.subtopic)) {
        subtopics[d.topic].push(d.subtopic);
      }
    });
    return subtopics;
  }, [data]);

  const filteredEntries = useMemo(() => {
    // When searching, ignore topic/subtopic filters — search globally across all data
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return data.filter((d) =>
        d.topic.toLowerCase().includes(query) ||
        d.subtopic.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.key_points?.some(kp => kp.toLowerCase().includes(query))
      );
    }

    let entries = data;
    if (activeTopic) {
      entries = entries.filter((d) => d.topic === activeTopic);
    }
    if (activeSubtopic) {
      entries = entries.filter((d) => d.subtopic === activeSubtopic);
    }
    return entries;
  }, [data, activeTopic, activeSubtopic, searchQuery]);

  const handleAdd = (entry: DataEntry) => {
    setData((prev) => [...prev, entry]);
    setShowForm(false);
    setActiveTopic(entry.topic);
    setActiveSubtopic(null);
  };

  const handleSelectTopic = (topic: string) => {
    if (activeTopic === topic) {
      setActiveTopic(null);
      setActiveSubtopic(null);
    } else {
      setActiveTopic(topic);
      setActiveSubtopic(null);
    }
    setMobileMenuOpen(false);
  };

  const handleSelectSubtopic = (subtopic: string) => {
    setActiveSubtopic(activeSubtopic === subtopic ? null : subtopic);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="flex flex-col max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 h-14">
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
          <div className="px-4 pb-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search topics, subtopics, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
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
            subtopicsByTopic={subtopicsByTopic}
            activeSubtopic={activeSubtopic}
            onSelectSubtopic={handleSelectSubtopic}
          />
          {(activeTopic || activeSubtopic) && (
            <button
              onClick={() => { setActiveTopic(null); setActiveSubtopic(null); }}
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
                subtopicsByTopic={subtopicsByTopic}
                activeSubtopic={activeSubtopic}
                onSelectSubtopic={handleSelectSubtopic}
              />
              {(activeTopic || activeSubtopic) && (
                <button
                  onClick={() => { setActiveTopic(null); setActiveSubtopic(null); setMobileMenuOpen(false); }}
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

          {/* Book Index View - shown when no topic/subtopic/search is active */}
          {!activeTopic && !activeSubtopic && !searchQuery ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold text-foreground mb-2">Table of Contents</h2>
                <p className="text-muted-foreground">Browse through all available topics</p>
              </div>

              <div className="space-y-1">
                {topics.map((topic, index) => {
                  const subtopics = subtopicsByTopic[topic] || [];
                  const count = entryCounts[topic] || 0;

                  return (
                    <div key={topic} className="border-b border-border/50 last:border-0">
                      <button
                        onClick={() => handleSelectTopic(topic)}
                        className="w-full text-left py-4 px-4 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-mono text-muted-foreground w-8">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {topic}
                              </h3>
                            </div>
                            {subtopics.length > 0 && (
                              <div className="ml-11 space-y-1">
                                {subtopics.map((subtopic, subIndex) => (
                                  <div key={subtopic} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-mono text-xs">
                                      {String(index + 1)}.{String(subIndex + 1)}
                                    </span>
                                    <span>{subtopic}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {count} {count === 1 ? 'entry' : 'entries'}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {topics.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Database className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No entries yet. Add one to get started.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Topic/Search View */}
              <div className="mb-4">
                <button
                  onClick={() => { setActiveTopic(null); setActiveSubtopic(null); setSearchQuery(""); }}
                  className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-full bg-card border shadow-md text-muted-foreground hover:text-foreground hover:shadow-lg transition-all group"
                >
                  <ChevronRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                  Table of Contents
                </button>
                <h2 className="text-lg font-semibold text-foreground">
                  {searchQuery ? `Search Results for "${searchQuery}"` : (activeSubtopic ? activeSubtopic : activeTopic || "All Topics")}
                </h2>
                {activeSubtopic && activeTopic && !searchQuery && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {activeTopic}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
                  {searchQuery && " found"}
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
                  <p>No entries found.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
