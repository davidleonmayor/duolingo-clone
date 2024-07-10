"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";

export function HeartsModal() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, open, close } = useHeartsModal();

  const onClick = () => {
    close();
    router.push("/store");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            {/* TODO: set disappointed mascot face */}
            <Image src="/mascot.svg" alt="Sad Mascot" width={80} height={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Get Pro fout unlimited hearts, or purchase them in the store.
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base">
          You need hearts to keep learning.
        </DialogDescription>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={onClick}
            >
              Get unlimited hearts
            </Button>
            <Button
              variant="primaryOutline"
              className="w-full"
              size="lg"
              onClick={close}
            >
              No thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
