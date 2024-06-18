import { clerkMiddleware } from "@clerk/nextjs/server";

//: TODO config matcher rout and protect route
// const isProtectedRoute = createRouteMatcher(["/"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
