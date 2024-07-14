import { redirect } from "next/navigation";

import {
  getUserProgress,
  getUserSubscription,
  getTopTenUsers,
} from "@/db/queries";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Separator } from "@/components/ui/separator";
import { Ranking } from "./ranking";
import Image from "next/image";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

type Props = {};

const LeaderboardPage = async ({}: Props) => {
  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
    getTopTenUsers(),
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
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            width={90}
            height={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          <Ranking users={leaderboard} />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
