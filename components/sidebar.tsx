import Link from "next/link";
import Image from "next/image";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "@/components/sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem label="Quests" href="/quests" iconSrc="/quests.png" />
        <SidebarItem label="Shop" href="/shop" iconSrc="/shop.svg" />
      </div>
      {/* TODO: The modal for the provider clerk appears, but it doesn't let you click on it It's like a z-index is preventing it or something similar, because in desktop mode it works correctly */}
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};
