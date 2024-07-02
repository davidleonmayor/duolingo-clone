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
import { useExitModal } from "@/store/use-exit-modal";

export function ExitModal() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, open, close } = useExitModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            {/* TODO: set sad mascot face */}
            <Image src="/mascot.svg" alt="Sad Mascot" width={80} height={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Wait, don&apos;t go!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base">
          you&apos;re about to leave the lesson. Are You sure?
        </DialogDescription>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={close}
            >
              Keep learning
            </Button>
            <Button
              variant="dangerOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                close();
                router.push("/learn");
              }}
            >
              End session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
