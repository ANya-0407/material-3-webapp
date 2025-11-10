// API から受け取るデータ型
export type EyesTrendsApiProps = {
    local_area: string;
    local_trends: string[];
    global_trends: string[];
};

// フロントエンドで扱うデータ型
export type EyesTrendsProps = {
    localArea: string;
    localTrends: string[];
    globalTrends: string[];
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesTrendsProps = (api: EyesTrendsApiProps): EyesTrendsProps => {
    return {
        localArea: api.local_area,
        localTrends: api.local_trends,
        globalTrends: api.global_trends
    };
};