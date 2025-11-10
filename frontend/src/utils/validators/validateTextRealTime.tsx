/**
 * テキストバリデーション(入力中用)
 *
 * @param input - 入力文字列
 * @param maxLength - 最大文字数（省略時は無制限）
 * 
 * @returns サニタイズ済みの文字列
 */
export const validateTextRealTime = (input: string, maxLength?: number): string => {
    // 最大長制限（任意）
    if (typeof maxLength === "number" && maxLength > 0) {
        return input.slice(0, maxLength);
    }

    return input;
};