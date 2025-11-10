//EyesTalkContentsFooterのZodスキーマ定義

import { z } from "zod";
import {
    MESSAGE_ALLOWED_MIME,
    MAX_FILE_BYTES,
    MAX_MESSAGE_FILES,
    MAX_MESSAGE_TEXT_LETTERS
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
const MESSAGE_ALLOWED_MIME_SET = new Set<string>([...MESSAGE_ALLOWED_MIME]);

// ---- schema -----------------------------------------------------
// 1ファイルのチェック
const fileFieldSchema = z.unknown().superRefine((v, ctx) => {
    if (!isFileLike(v)) {
        ctx.addIssue({ code: "custom", message: "file_invalid" });
        return;
    }
    if (!MESSAGE_ALLOWED_MIME_SET.has(v.type)) {
        ctx.addIssue({ code: "custom", message: "file_type_not_allowed" });
    }
    if (v.size > MAX_FILE_BYTES) {
        ctx.addIssue({ code: "custom", message: "file_too_large" });
    }
});

// 本体
export const messageSchema = z.object({
    files: z
        .array(fileFieldSchema)
        .max(MAX_MESSAGE_FILES, { message: "files_too_many" })
        .default([]),

    text: z
        .string()
        .max(MAX_MESSAGE_TEXT_LETTERS, { message: "text_too_long" })
        .optional(),
});

export type MessageSchemaInput = z.infer<typeof messageSchema>;
