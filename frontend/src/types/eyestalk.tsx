import { EyesAccountMainInfoApiProps, EyesAccountMainInfoProps, convertEyesAccountMainInfoProps } from "src/types";

// API から受け取るデータ型
export type EyesTalkApiProps = {
    talk_id: string;
    talk_name: string;
    talk_icon: string;
    members: EyesAccountMainInfoApiProps[];
    is_group: boolean;
    is_silent: boolean;
    is_invisible: boolean;
    is_friend: boolean;
};

// フロントエンドで扱うデータ型
export type EyesTalkProps = {
    talkId: string;
    talkName: string;
    talkIcon: string;
    members: EyesAccountMainInfoProps[];
    isGroup: boolean;
    isSilent: boolean;
    isInvisible: boolean;
    isFriend: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesTalkProps = (api: EyesTalkApiProps): EyesTalkProps => {
    return {
        talkId: api.talk_id,
        talkName: api.talk_name,
        talkIcon: api.talk_icon,
        members: api.members.map(convertEyesAccountMainInfoProps),
        isGroup: api.is_group,
        isSilent: api.is_silent,
        isInvisible: api.is_invisible,
        isFriend: api.is_friend
    };
};
