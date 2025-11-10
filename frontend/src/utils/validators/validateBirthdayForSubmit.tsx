export type ValidationResult = {
    isValid: boolean;
    sanitized: string;
    error?: string;
};

/**
 * 誕生日バリデーション（送信前用）
 *
 * @param year - 年
 * @param month - 月
 * @param day - 日
 * 
 * @returns 適切な形式であったかどうか、サニタイズ済みのISO文字列、エラーの種類
 */
export const validateBirthdayForSubmit = ( year: number, month: number, day: number ): ValidationResult => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 年チェック
    if (year < 1900 || year > currentYear) {
        return {
            isValid: false,
            sanitized: "",
            error: "正しく入力し直してください",
        };
    }

    // 月チェック
    if (month < 1 || month > 12) {
        return {
            isValid: false,
            sanitized: "",
            error: "正しく入力し直してください",
        };
    }

    // 日チェック（その月の日数以内か）
    const date = new Date(year, month - 1, day); 
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return {
            isValid: false,
            sanitized: "",
            error: "正しく入力し直してください",
        };
    }

    // OKならISO文字列を作成
    const isoString = new Date(year, month - 1, day).toISOString();

    return {
        isValid: true,
        sanitized: isoString,
    };
};