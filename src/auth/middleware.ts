import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { defineMiddleware } from "astro:middleware";
import { User } from "../context/user/User";
import { getDatabase } from "../database/getDatabase";

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

export const authorization = defineMiddleware(async (context, next) => {
  if (!isAdminRoute(context.request)) return next();

  const userId = context.locals.auth().userId;

  if (!userId) {
    console.error("No userId found!");
    return next("/");
  }

  const database = getDatabase();

  if (database.isError) {
    console.error("Error while trying to connection database!", database.error);
    return next("/");
  }

  const userResult = await User.findById(userId, database.value);

  if (userResult.isError) {
    console.error("Error while trying to fetch user!", userResult.error);
  }

  if (userResult.isOk && userResult.value?.role === "admin") return next();

  console.info("User is no admin.");

  return next("/");
});
