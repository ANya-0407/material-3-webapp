import { ClusterAliasApiProps, ClusterAliasProps, convertClusterAliasProps } from "src/types";

// API から受け取るデータ型
export type ClusterCommentApiProps = {
    comment_id: string;
    commentater: ClusterAliasApiProps
    text?: string;
    images: string[];
    quote_comment?: ClusterCommentApiProps;
    created_at: string;
    good_number: number;
    bad_number: number;
    is_own: boolean;
    is_good_for_me: boolean;
    is_bad_for_me: boolean;
};

// フロントエンドで扱うデータ型
export type ClusterCommentProps = {
    commentId: string;
    commentater: ClusterAliasProps
    text?: string;
    images: string[];
    quoteComment?: ClusterCommentProps;
    createdAt: Date;
    goodNumber: number;
    badNumber: number;
    isOwn: boolean;
    isGoodForMe: boolean;
    isBadForMe: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertClusterCommentProps = (api: ClusterCommentApiProps): ClusterCommentProps => {
    return {
        commentId: api.comment_id,
        commentater: convertClusterAliasProps(api.commentater),
        text: api.text,
        images: api.images,
        quoteComment: api.quote_comment ? convertClusterCommentProps(api.quote_comment) : undefined,
        createdAt: new Date(api.created_at),
        goodNumber: api.good_number,
        badNumber: api.bad_number,
        isOwn: api.is_own,
        isGoodForMe: api.is_good_for_me,
        isBadForMe: api.is_bad_for_me
    };
};


