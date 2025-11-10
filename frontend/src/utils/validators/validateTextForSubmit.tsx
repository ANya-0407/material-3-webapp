export type ValidationResult = {
    isValid: boolean;
    sanitized: string;
    error?: string;
};

/**
 * テキストバリデーション（送信前用）
 *
 * @param input - 入力文字列
 * @param minLength - 最小文字数（省略時は 0）
 * @param maxLength - 最大文字数（省略時は無制限）
 * 
 * @returns - 適切な形式であったかどうか、サニタイズ済みの文字列、エラーの種類
 */
export const validateTextForSubmit = ( input: string, minLength: number = 0, maxLength?: number): ValidationResult => {
    // エスケープ処理
    const replaced = input
                        .replace(/&/g, "&amp;")   // 最初に & をエスケープする（他と競合しないように）
                        .replace(/</g, "&lt;")    // < タグ開始を無効化
                        .replace(/>/g, "&gt;")    // > タグ終了を無効化
                        .replace(/"/g, "&quot;")  // " ダブルクォート
                        .replace(/'/g, "&#039;"); // ' シングルクォート

    // 最大長制限（任意）
    const trimmed = typeof maxLength === "number" ? replaced.slice(0, maxLength) : replaced;

    // 最小長チェック
    if (trimmed.length < minLength) {
        return {
            isValid: false,
            sanitized: "",
            error: `文字数が足りません`,
        };
    }

    return {
        isValid: true,
        sanitized: trimmed,
    };
};