//SignupFormのZodスキーマ定義

import { z } from "zod";
import {
    MAX_EMAIL_LETTERS,
    MAX_PASSWORD_LETTERS,
    MIN_PASSWORD_LETTERS
} from "src/utils/schemas";

// ---- schema -----------------------------------------------------
export const signupSchema = z.object({
    email: z
        .string({ required_error: "required_email" })
        .max(MAX_EMAIL_LETTERS, { message: "email_too_long" })
        .email({ message: "invalid_email" }),

    password: z
        .string({ required_error: "required_password" })
        .min(MIN_PASSWORD_LETTERS, { message: "password_too_short" })
        .max(MAX_PASSWORD_LETTERS, { message: "password_too_long" })
        .regex(/^[a-zA-Z0-9]+$/, { message: "password_invalid_chars" }),
});

export type SingupSchemaInput = z.infer<typeof signupSchema>;