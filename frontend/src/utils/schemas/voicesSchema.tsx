//VoicesFormのZodスキーマ定義

import { z } from "zod";
import {
    VOICES_ALLOWED_MIME,
    MAX_IMAGE_BYTES,
    MAX_VOICES_IMAGES,
    MAX_VOICES_TEXT_LETTERS
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
const VOICES_ALLOWED_MIME_SET = new Set<string>([...VOICES_ALLOWED_MIME]);

// ---- schema -----------------------------------------------------
// 1ファイルのチェック
const imageFieldSchema = z.unknown().superRefine((v, ctx) => {
    if (!isFileLike(v)) {
        ctx.addIssue({ code: "custom", message: "image_invalid" });
        return;
    }
    if (!VOICES_ALLOWED_MIME_SET.has(v.type)) {
        ctx.addIssue({ code: "custom", message: "image_type_not_allowed" });
    }
    if (v.size > MAX_IMAGE_BYTES) {
        ctx.addIssue({ code: "custom", message: "image_too_large" });
    }
});

// 本体
export const voicesSchema = z.object({
    images: z
        .array(imageFieldSchema)
        .max(MAX_VOICES_IMAGES, { message: "images_too_many" })
        .default([]),

    text: z
        .string()
        .max(MAX_VOICES_TEXT_LETTERS, { message: "text_too_long" })
        .optional(),
});

export type VoicesSchemaInput = z.infer<typeof voicesSchema>;

