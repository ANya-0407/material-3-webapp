//EyesCommentFormのZodスキーマ定義

import { z } from "zod";
import {
    MAX_EYES_COMMENT_LETTERS
} from "src/utils/schemas";

// ---- schema -----------------------------------------------------
export const eyesCommentSchema = z.object({
    text: z
        .string()
        .max(MAX_EYES_COMMENT_LETTERS, { message: "text_too_long" })
        .optional(),
});

export type EyesCommentSchemaInput = z.infer<typeof eyesCommentSchema>;