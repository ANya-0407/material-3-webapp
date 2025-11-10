import { EyesAccountMainInfoApiProps, EyesAccountMainInfoProps, convertEyesAccountMainInfoProps } from "src/types";

// API から受け取るデータ型
export type EyesProfilePageInfoApiProps = {
    main_info: EyesAccountMainInfoApiProps;
    header_image: string;
    account_explanation: string;
    following_number: number;
    followers_number: number;
    birthday: string;
    is_own: boolean;
    live_id?: string;
};

// フロントエンドで扱うデータ型
export type EyesProfilePageInfoProps = {
    mainInfo: EyesAccountMainInfoProps;
    headerImage: string;
    accountExplanation: string;
    followingNumber: number;
    followersNumber: number;
    birthday: Date;
    isOwn: boolean;
    liveId?: string;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertEyesProfilePageInfoProps = (api: EyesProfilePageInfoApiProps): EyesProfilePageInfoProps => {
    return {
        mainInfo: convertEyesAccountMainInfoProps(api.main_info),
        headerImage: api.header_image,
        accountExplanation: api.account_explanation,
        followingNumber: api.following_number,
        followersNumber: api.followers_number,
        birthday: new Date(api.birthday), 
        isOwn: api.is_own,
        liveId: api.live_id
    };
};
