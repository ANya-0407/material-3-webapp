import { EyesAccountMainInfoApiProps, EyesAccountMainInfoProps, convertEyesAccountMainInfoProps } from "src/types";

// API から受け取るデータ型
export type EyesSiderApiProps = {
    account: EyesAccountMainInfoApiProps;
    is_message_unaware: boolean;
    is_notice_unaware: boolean;
    is_wallet_unaware: boolean;
};

// フロントエンドで扱うデータ型
export type EyesSiderProps = {
    account: EyesAccountMainInfoProps;
    isMessageUnaware: boolean;
    isNoticeUnaware: boolean;
    isWalletUnaware: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesSiderProps = (apiResponse: EyesSiderApiProps): EyesSiderProps => {
    return {
        account: convertEyesAccountMainInfoProps(apiResponse.account),
        isMessageUnaware: apiResponse.is_message_unaware,
        isNoticeUnaware: apiResponse.is_notice_unaware,
        isWalletUnaware: apiResponse.is_wallet_unaware
    };
};


