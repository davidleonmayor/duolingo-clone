import { QUESTS } from "@/constants/index";

import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

type Props = {
  points: number;
};

export const Quests = ({ points }: Props) => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between w-full space-y-2">
        <h3 className="font-bold text-lg">Quests</h3>
        <Link href="/quests" className="text-blue-400 font-bold">
          View all
        </Link>
      </div>
      <ul className="w-full space-y-2">
        {QUESTS.map((quest, index) => {
          const progress = (points / quest.value) * 100;

          return (
            <div
              key={index}
              className="flex items-center w-full border-t-2 p-2 gap-x-3"
            >
              <Image src="/point.svg" alt="Points" width={30} height={30} />
              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-neutral-700 text-sm font-bold">
                  {quest.title}
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
