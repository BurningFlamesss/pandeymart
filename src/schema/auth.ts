import z from "zod";

const signUpSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    image: z.string()
})

const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    rememberMe: z.boolean()
})

const forgetPasswordSchema = z.object({
    email: z.email()
})

export { signUpSchema, signInSchema, forgetPasswordSchema };