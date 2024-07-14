import { redirect } from "next/navigation";

import { QUESTS } from "@/constants/index";

import { getUserProgress, getUserSubscription } from "@/db/queries";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Promo } from "@/components/promo";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

type Props = {};

const QuestsPage = async ({}: Props) => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  // user has no progress or active course yet
  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/quests.png" alt="Quests" width={90} height={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Quests
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Complete quests by earning points.
          </p>

          <ul className="w-full">
            {QUESTS.map((quest, index) => {
              const progress = (userProgress.points / quest.value) * 100;

              return (
                <div
                  key={index}
                  className="flex items-center w-full p-4 gap-x-4 border-t-2"
                >
                  <Image src="/point.svg" alt="Points" width={40} height={40} />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700 text-xl font-bold">
                      {quest.title}
                    </p>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
