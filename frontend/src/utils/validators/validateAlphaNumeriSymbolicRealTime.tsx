/**
 * 英数字記号バリデーション(入力中用)
 *
 * @param input - 入力文字列
 * @param maxLength - 最大文字数（省略時は無制限）
 * 
 * @returns - サニタイズ済みの文字列
 */
export const validateAlphaNumeriSymbolicRealTime = (input: string, maxLength?: number): string => {
    // 半角英数字記号のみを抽出
    const replaced = input.replace(/[^a-zA-Z0-9@._\-+]/g, "");

    // 最大長制限（任意）
    if (typeof maxLength === "number" && maxLength > 0) {
        return replaced.slice(0, maxLength);
    }

    return replaced;
};