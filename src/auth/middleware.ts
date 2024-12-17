import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { defineMiddleware } from "astro:middleware";
import { UserRepository } from "../context/user/UserRepository";

const isPublicRoute = createRouteMatcher(["/"]);

export const authentication = clerkMiddleware((auth, context, next) => {
  if (isPublicRoute(context.request)) return next();

  const { redirectToSignIn, userId } = auth();
  const isAuthenticated = !!userId?.length;

  if (!isAuthenticated) return redirectToSignIn();

  context.locals.authProvider = "clerk";

  return next();
});

const isAdminRoute = createRouteMatcher(["/users"]);

let users: UserRepository | undefined = undefined;

export const authorization = defineMiddleware(async (context, next) => {
  if (!isAdminRoute(context.request)) return next();

  const userId = context.locals.auth().userId;

  if (!userId) {
    console.error("No userId found!");
    return next("/");
  }

  if (!users) {
    try {
      users = new UserRepository();
    } catch (e) {
      console.error("Error while trying to open the user repository!", e);
      return next("/");
    }
  }

  const userResult = await users.findById(userId);

  if (userResult.isError) {
    console.error("Error while trying to fetch user!", userResult.error);
  }

  if (userResult.isOk && userResult.value?.role === "admin") return next();

  console.info("User is no admin.");

  return next("/");
});
