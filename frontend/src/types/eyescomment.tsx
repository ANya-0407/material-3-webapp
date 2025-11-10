import { EyesAccountMainInfoApiProps, EyesAccountMainInfoProps, convertEyesAccountMainInfoProps } from "src/types";

// API から受け取るデータ型
export type EyesCommentApiProps = {
    comment_id: string;
    commentater: EyesAccountMainInfoApiProps;
    text: string;
    created_at: string;
    good_number: number;
    bad_number: number;
    is_own: boolean;
    is_good_for_me: boolean;
    is_bad_for_me: boolean;
};

// フロントエンドで扱うデータ型
export type EyesCommentProps = {
    commentId: string;
    commentater: EyesAccountMainInfoProps;
    text: string;
    createdAt: Date;
    goodNumber: number;
    badNumber: number;
    isOwn: boolean;
    isGoodForMe: boolean;
    isBadForMe: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesCommentProps = (api: EyesCommentApiProps): EyesCommentProps => {
    return {
        commentId: api.comment_id,
        commentater: convertEyesAccountMainInfoProps(api.commentater),
        text: api.text,
        createdAt: new Date(api.created_at),
        goodNumber: api.good_number,
        badNumber: api.bad_number,
        isOwn: api.is_own,
        isGoodForMe: api.is_good_for_me,
        isBadForMe: api.is_bad_for_me
    };
};

