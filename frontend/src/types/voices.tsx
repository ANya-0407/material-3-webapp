import {
    VoicesAccountMainInfoApiProps, VoicesAccountMainInfoProps, convertVoicesAccountMainInfoProps,
} from "src/types";

// API から受け取るデータ型
export type VoicesApiProps = {
    voices_id: string;
    poster: VoicesAccountMainInfoApiProps;
    text?: string;
    images: string[];
    hashtag?: string;
    created_at: string;
    view_count: number;
    good_count: number;
    is_own: boolean;
    is_good_for_me: boolean;
    is_my_bookmark: boolean;
};

// フロントエンドで扱うデータ型
export type VoicesProps = {
    voicesId: string;
    poster: VoicesAccountMainInfoProps;
    text?: string;
    images: string[];
    hashtag?: string;
    createdAt: Date;
    viewCount: number;
    goodCount: number;
    isOwn: boolean;
    isGoodForMe: boolean;
    isMyBookmark: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertVoicesProps = (api: VoicesApiProps): VoicesProps => {
    return {
        voicesId: api.voices_id,
        poster: convertVoicesAccountMainInfoProps(api.poster),
        text: api.text,
        images: api.images,
        hashtag: api.hashtag,
        createdAt: new Date(api.created_at), 
        viewCount: api.view_count,
        goodCount: api.good_count,
        isOwn: api.is_own,
        isGoodForMe: api.is_good_for_me,
        isMyBookmark: api.is_my_bookmark
    };
};
