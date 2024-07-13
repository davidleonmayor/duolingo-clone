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

/**
 * Component that displays multiple options as cards.
 * Users can select an option, and the component visually indicates the current status (correct, wrong, none).
 *
 * @param {SelectChallengeOptions[]} props.options - Array of options to display as cards.
 * @param {Function} props.onSelect - Callback function invoked with the id of the selected option.
 * @param {"correct"|"wrong"|"none"} props.status - Current status of the challenge, affecting visual feedback.
 * @param {number} [props.selectedOption] - The id of the currently selected option, if any.
 * @param {boolean} [props.disabled=false] - If true, disables interaction with the challenge.
 * @param {SelectChallenges["type"]} props.type - The type of challenge, influencing how options are rendered.
 */
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
          "grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]" // Ajuste aquí
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
