import { VoicesAccountMainInfoApiProps, VoicesAccountMainInfoProps, convertVoicesAccountMainInfoProps } from "src/types";

// API から受け取るデータ型
export type VoicesSiderApiProps = {
    account: VoicesAccountMainInfoApiProps;
    is_message_unaware: boolean;
    is_notice_unaware: boolean;
    is_wallet_unaware: boolean;
};

// フロントエンドで扱うデータ型
export type VoicesSiderProps = {
    account: VoicesAccountMainInfoProps;
    isMessageUnaware: boolean;
    isNoticeUnaware: boolean;
    isWalletUnaware: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertVoicesSiderProps = (apiResponse: VoicesSiderApiProps): VoicesSiderProps => {
    return {
        account: convertVoicesAccountMainInfoProps(apiResponse.account),
        isMessageUnaware: apiResponse.is_message_unaware,
        isNoticeUnaware: apiResponse.is_notice_unaware,
        isWalletUnaware: apiResponse.is_wallet_unaware
    };
};
