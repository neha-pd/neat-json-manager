import { FileText, CheckCircle2 } from "lucide-react";
import type { DataEntry } from "@/types/data";

interface EntryCardProps {
  entry: DataEntry;
}

const EntryCard = ({ entry }: EntryCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3 mb-3">
        <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <h3 className="font-semibold text-card-foreground leading-snug">{entry.subtopic}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed ml-8">{entry.description}</p>
      {entry.key_points && entry.key_points.length > 0 && (
        <ul className="mt-4 ml-8 flex flex-col gap-1.5">
          {entry.key_points.map((point, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntryCard;
