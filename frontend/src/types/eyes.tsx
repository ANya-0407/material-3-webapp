import {
    EyesAccountMainInfoApiProps, EyesAccountMainInfoProps, convertEyesAccountMainInfoProps,
} from "src/types";

// API から受け取るデータ型
export type EyesApiProps = {
    eyes_id: string;
    poster: EyesAccountMainInfoApiProps;
    image: string;
    tag?: string;
    hashtag?: string;
    friends_post_ids?: string[];
    created_at: string;
    view_count: number;
    good_count: number;
    is_own: boolean;
    is_good_for_me: boolean;
    is_my_bookmark: boolean;
};

// フロントエンドで扱うデータ型
export type EyesProps = {
    eyesId: string;
    poster: EyesAccountMainInfoProps;
    image: string;
    tag?: string;
    hashtag?: string;
    friendsPostIds?: string[];
    createdAt: Date; 
    viewCount: number;
    goodCount: number;
    isOwn: boolean;
    isGoodForMe: boolean;
    isMyBookmark: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesProps = (api: EyesApiProps): EyesProps => {
    return {
        eyesId: api.eyes_id,
        poster: convertEyesAccountMainInfoProps(api.poster),
        image: api.image,
        tag: api.tag,
        hashtag: api.hashtag,
        friendsPostIds: api.friends_post_ids,
        createdAt: new Date(api.created_at), 
        viewCount: api.view_count,
        goodCount: api.good_count,
        isOwn: api.is_own,
        isGoodForMe: api.is_good_for_me,
        isMyBookmark: api.is_my_bookmark
    };
};
