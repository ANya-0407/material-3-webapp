// API から受け取るデータ型
export type EyesAccountMainInfoApiProps = {
    account_id: string;
    account_name: string;
    account_icon: string;
};

// フロントエンドで扱うデータ型
export type EyesAccountMainInfoProps = {
    accountId: string;
    accountName: string;
    accountIcon: string;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesAccountMainInfoProps = (api: EyesAccountMainInfoApiProps): EyesAccountMainInfoProps => {
    return {
        accountId: api.account_id,
        accountName: api.account_name,
        accountIcon: api.account_icon,
    };
};
