import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isPublicRoute = createRouteMatcher(["/"]);

export const onRequest = clerkMiddleware((auth, context) => {
  const { redirectToSignIn, userId } = auth();

  if (!isPublicRoute(context.request) && !userId) {
    return redirectToSignIn();
  }

  return;
});
