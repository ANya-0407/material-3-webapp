//EyesFormのZodスキーマ定義

import { z } from "zod";
import {
    EYES_ALLOWED_MIME,
    MAX_IMAGE_BYTES,
    MAX_TAG_LETTERS,
    MAX_HASHTAG_LETTERS,
    MAX_HASHTAGS
} from "src/utils/schemas";

type FileLike = { size: number; type: string; name: string };
const hasFileCtor = typeof File !== "undefined";

const isFileLike = (v: unknown): v is FileLike => {
    if (hasFileCtor && v instanceof File) return true;
    if (!v || typeof v !== "object") return false;
    const anyv = v as Record<string, unknown>;
    return (
        typeof anyv.size === "number" &&
        typeof anyv.type === "string" &&
        typeof anyv.name === "string"
    );
};

// Array → Set（型のズレを吸収）
const EYES_ALLOWED_MIME_SET = new Set<string>([...EYES_ALLOWED_MIME]);

// ---- schema -----------------------------------------------------
// 1ファイルのチェック
export const imageFieldSchema = z.unknown().superRefine((v, ctx) => {
    if (!isFileLike(v)) {
        ctx.addIssue({ code: "custom", message: "image_invalid" });
        return;
    }
    if (!EYES_ALLOWED_MIME_SET.has(v.type)) {
        ctx.addIssue({ code: "custom", message: "image_type_not_allowed" });
    }
    if (v.size > MAX_IMAGE_BYTES) {
        ctx.addIssue({ code: "custom", message: "image_too_large" });
    }
});

// 本体
export const eyesSchema = z.object({
    image: imageFieldSchema,

    tag: z
        .string()
        .max(MAX_TAG_LETTERS, { message: "tag_too_long" })
        .optional(),

    hashtags: z
        .array(z.string().max(MAX_HASHTAG_LETTERS, { message: "hashtag_too_long" }))
        .max(MAX_HASHTAGS, { message: "hashtags_too_many" })
        .default([]),
});

export type EyesSchemaInput = z.infer<typeof eyesSchema>;