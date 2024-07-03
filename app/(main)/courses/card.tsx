import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
};

/**
 * Card component displays an interactive card with an image, title, and optional active status.
 *
 * @param props.title - The title displayed on the card.
 * @param props.id - The identifier for the card, used in the onClick handler.
 * @param props.imageSrc - The source URL for the card image.
 * @param props.onClick - Callback function triggered when the card is clicked.
 * @param props.disabled - If true, the card is non-interactive and dimmed. Defaults to false.
 * @param props.active - If true, the card shows an active indicator. Defaults to false.
 */
export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled = false,
  active = false,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {/* Container for the active indicator, shows if active course */}
      <div className="min-[24px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-600 flex items-center justify-center p-1.5">
            <Check className="text-white stroke-[4] h-4 w-4 " />
          </div>
        )}
      </div>
      <Image
        src={imageSrc}
        alt={title}
        height={70}
        width={93.33}
        className="rounded-lg drop-shadow-md border object-cover"
      />
      <p className="text-neutral-700 text-center font-bold mt-3">{title}</p>
    </div>
  );
};
