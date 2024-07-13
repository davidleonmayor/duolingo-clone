"use client";

import { useTransition } from "react";

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { POINTS_TO_REFILL } from "@/constants/index";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
  const [pending, startTransition] = useTransition();

  // Refill hearts action.
  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return;
    }

    startTransition(() => {
      refillHearts()
        .then((res) => {
          if (res?.error === "hearts") {
            toast.error("Full heats.");
          } else if (res?.error === "points") {
            toast.error("Missing points.");
          }
        })
        .catch(() => toast.error("Unspected error."));
    });
  };

  // Upgrade action.
  const onUpgrade = () => {
    if (pending) {
      return;
    }
    console.log("befere createStripeUrl");

    startTransition(() => {
      createStripeUrl()
        .then((res) => {
          if (res.data) window.location.href = res.data;
        })
        .catch(() => toast.error("Something went wrong."));
    });

    console.log("after createStripeUrl");
  };

  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src="/heart.svg" alt="Heart" width={60} height={60} />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Refill hearts
          </p>
        </div>
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
        >
          {hearts === 5 ? (
            "Full"
          ) : (
            <div className="flex items-center">
              <Image src="/point.svg" alt="Points" width={20} height={20} />
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>

      <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
        {/* TODO add icon */}
        <Image src="/unlimited.svg" alt="Unlimited" width={60} height={60} />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Unlimited hearts
          </p>
          <Button onClick={onUpgrade} disabled={pending}>
            {hasActiveSubscription ? "settings" : "upgrade"}
          </Button>
        </div>
      </div>
    </ul>
  );
};
