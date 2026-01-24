import z from "zod";

const authenticateSearchParams = z.object({
    mode: z.enum(["login", "signup"]).catch("signup"),
})

type AuthenticateSearchParams = z.infer<typeof authenticateSearchParams>

export { AuthenticateSearchParams, authenticateSearchParams };