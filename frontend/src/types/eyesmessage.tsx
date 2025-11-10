import { EyesAccountMainInfoApiProps, EyesAccountMainInfoProps, convertEyesAccountMainInfoProps } from "src/types";

// API から受け取るデータ型
export type EyesMessageApiProps = {
    message_id: string;
    message_text?: string;
    message_files: string[];
    quote_message?: EyesMessageApiProps;
    sender: EyesAccountMainInfoApiProps;
    created_at: string;
    is_own: boolean;
    is_read: boolean;
};

// フロントエンドで扱うデータ型
export type EyesMessageProps = {
    messageId: string;
    messageText?: string;
    messageFiles: string[];
    quoteMessage?: EyesMessageProps;
    sender: EyesAccountMainInfoProps;
    createdAt: Date;
    isOwn: boolean;
    isRead: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesMessageProps = (api: EyesMessageApiProps): EyesMessageProps => {
    return {
        messageId: api.message_id,
        messageText: api.message_text,
        messageFiles: api.message_files,
        quoteMessage: api.quote_message ? convertEyesMessageProps(api.quote_message) : undefined,
        sender: convertEyesAccountMainInfoProps(api.sender),
        createdAt: new Date(api.created_at), 
        isOwn: api.is_own,
        isRead: api.is_read
    };
};

