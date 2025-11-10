//PasswordForgotFormのZodスキーマ定義

import { z } from "zod";

export const passwordForgotSchema = z.object({
    phone: z
        .string({ required_error: "required_phone" })
        .regex(/^\+[1-9]\d{4,14}$/, { message: "invalid_phone_format" }),

    email: z
        .string({ required_error: "required_email" })
        .email({ message: "invalid_email" }),

    certification: z
        .string({ required_error: "required_certification" })
        .regex(/^\d{6}$/, { message: "invalid_certification_code" }), 
});

export type PasswordForgotInput = z.infer<typeof passwordForgotSchema>;