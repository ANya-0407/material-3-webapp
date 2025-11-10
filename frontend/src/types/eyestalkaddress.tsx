// API から受け取るデータ型
export type EyesTalkAddressApiProps = {
    talk_id: string;
    talk_name: string;
    talk_icon: string;
    last_modified: string;
    last_message: string;
    is_read: boolean;
};

// フロントエンドで扱うデータ型
export type EyesTalkAddressProps = {
    talkId: string;
    talkName: string;
    talkIcon: string;
    lastModified: Date;
    lastMessage: string;
    isRead: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesTalkAddressProps = (api: EyesTalkAddressApiProps): EyesTalkAddressProps => {
    return {
        talkId: api.talk_id,
        talkName: api.talk_name,
        talkIcon: api.talk_icon,
        lastModified: new Date(api.last_modified),
        lastMessage: api.last_message,
        isRead: api.is_read
    };
};
