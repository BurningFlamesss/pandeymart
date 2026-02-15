import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { AppContext } from "@/types/router-context";
import { auth } from "@/lib/auth";

export const getSessionMiddleware = createMiddleware({ type: "request" }).server(
    async ({ next }) => {
        const headers = getRequestHeaders();
        const session = await auth.api.getSession({ headers })

        return await next({ context: { session: session } satisfies AppContext })
    }
);

export const requireAuth = createServerFn().middleware([getSessionMiddleware]).handler(
    ({ context }) => {
        if (!context.session) {
            throw redirect({ to: "/authenticate", search: { mode: "signup" } })
        }
    }
)

export const requireAdminAccess = createServerFn().middleware([getSessionMiddleware]).handler(
    ({ context }) => {
        if (!context.session) {
            throw redirect({ to: "/authenticate", search: { mode: "signup" } })
        }

        if (!context.session.user.id) {
            throw redirect({to: '/'})
        }
    }
)

export const AuthpageGuard = createServerFn().middleware([getSessionMiddleware]).handler(
    ({ context }) => {
        if (context.session) {
            throw redirect({ to: "/" })
        }
    }
)