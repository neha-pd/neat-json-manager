import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { DataEntry } from "@/types/data";

interface AddEntryFormProps {
  existingTopics: string[];
  onAdd: (entry: DataEntry) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ existingTopics, onAdd, onCancel }: AddEntryFormProps) => {
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [description, setDescription] = useState("");
  const [keyPointsText, setKeyPointsText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !subtopic.trim() || !description.trim()) return;

    const key_points = keyPointsText
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    onAdd({
      topic: topic.trim(),
      subtopic: subtopic.trim(),
      description: description.trim(),
      ...(key_points.length > 0 ? { key_points } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground">Add New Entry</h3>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Main Topic</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Projects Worked"
          list="existing-topics"
          required
        />
        <datalist id="existing-topics">
          {existingTopics.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtopic">Subtopic</Label>
        <Input
          id="subtopic"
          value={subtopic}
          onChange={(e) => setSubtopic(e.target.value)}
          placeholder="e.g. Feature Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the topic..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="key_points">Key Points (one per line, optional)</Label>
        <Textarea
          id="key_points"
          value={keyPointsText}
          onChange={(e) => setKeyPointsText(e.target.value)}
          placeholder={"Point 1\nPoint 2\nPoint 3"}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Entry
      </Button>
    </form>
  );
};

export default AddEntryForm;
