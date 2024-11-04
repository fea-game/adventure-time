import { sequence } from "astro:middleware";
import { authentication, authorization } from "./auth/middleware";

export const onRequest = sequence(authentication, authorization);
