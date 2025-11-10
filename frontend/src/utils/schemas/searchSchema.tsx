//SearchFormのZodスキーマ定義

import { z } from "zod";
import {
    MAX_SEARCH_LETTERS
} from "src/utils/schemas";

const RE_UNI_WHITESPACE =
    /[\u0009-\u000D\u0020\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/gu;
const RE_CONTROL = /[\u0000-\u001F\u007F-\u009F]/gu;
const RE_BIDI = /[\u200E\u200F\u202A-\u202E\u2066-\u2069\u061C]/gu;
const RE_INVISIBLE = /[\u200B-\u200D\u2060\uFEFF]/gu;

export const countGraphemes = (s: string): number => {
    // @ts-ignore
    const Seg: any = (globalThis as any).Intl?.Segmenter;
    if (Seg) {
        const seg = new Seg("ja", { granularity: "grapheme" });
        let n = 0;
        for (const _ of seg.segment(s)) n++;
        return n;
    }
    return Array.from(s).length;
};

// ---- schema -----------------------------------------------------
export const searchSchema = z.object({
    input: z
        .string()
        .transform((v) => sanitizeSearch(v))      // 無害化
        .refine((v) => v.length > 0)              // 空は禁止
        .refine((v) => v.length <= MAX_SEARCH_LETTERS), // 最大全長の最終確認
});

export type SearchSchemaInput = z.infer<typeof searchSchema>;