import { auth } from "@clerk/nextjs/server";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export const isAdminUser = () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  return ADMIN_USER_ID === userId;
};
