import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/env";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    },
    google: {
      enabled: true,
      clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 1 天
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 天缓存
      strategy: "jwe", // 使用加密策略
      refreshCache: true, // 启用自动刷新
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
