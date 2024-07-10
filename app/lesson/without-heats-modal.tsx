import Link from "next/link";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {};

export function WithoutHeatsModal({}: Props) {
  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            {/* TODO: set sad mascot face */}
            <Image src="/mascot.svg" alt="Sad Mascot" width={80} height={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Ho no, you don&apos;t have hearts!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base">
          You need hearts to keep learning.
        </DialogDescription>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Link href="/shop">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                // onClick={() => router.push("/shop")}
              >
                Obtain hearts
              </Button>
            </Link>

            <Link href="/learn">
              <Button
                variant="dangerOutline"
                className="w-full"
                size="lg"
                // onClick={() => {
                //   close();
                //   router.push("/learn");
                // }}
              >
                End session
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
