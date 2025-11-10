// API から受け取るデータ型
export type EyesFollowProfileApiProps = {
    account_id: string;
    account_name: string;
    account_icon: string;
    account_explanation?: string;
    is_official: boolean;
    is_mutual: boolean;
};

// フロントエンドで扱うデータ型
export type EyesFollowProfileProps = {
    accountId: string;
    accountName: string;
    accountIcon: string;
    accountExplanation?: string;
    isOfficial: boolean;
    isMutual: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesFollowProfileProps = (api: EyesFollowProfileApiProps): EyesFollowProfileProps => {
    return {
        accountId: api.account_id,
        accountName: api.account_name,
        accountIcon: api.account_icon,
        accountExplanation: api.account_explanation,
        isOfficial: api.is_official,
        isMutual: api.is_mutual
    };
};

