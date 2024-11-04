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

  const externalId = context.locals.auth().userId;
  const externalSystem = context.locals.authProvider;

  if (!externalId) return next("/");

  const database = getDatabase();

  if (database.isError) throw database.error;

  const userResult = await User.findByExternalId(
    { externalSystem, externalId },
    database.data
  );

  if (userResult.isError) {
    console.error("Error while trying to fetch user!", userResult.error);
  }

  if (userResult.isSuccess && userResult.data?.role === "admin") return next();

  return next("/");
});
