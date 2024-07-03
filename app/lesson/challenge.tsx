import type { SelectChallengeOptions, SelectChallenges } from "@/db/schema";

import { cn } from "@/lib/utils";

import { Card } from "./card";

type Props = {
  options: SelectChallengeOptions[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: SelectChallenges["type"];
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: Props) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(0,1fr))]"
      )}
    >
      {options.map((option, index) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          // TODO: remove hardcoded imageSrc
          imageSrc={"/mascot.svg" || option.imageSrc}
          shortcut={`${index + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};
