import { ClusterAliasApiProps, ClusterAliasProps, convertClusterAliasProps } from "src/types";

// API から受け取るデータ型
export type ClusterApiProps = {
    cluster_id: string;
    cluster_name: string;
    header_image: string;
    cluster_explanation: string;
    creator: ClusterAliasApiProps;
    created_at: string;
    participants_number: number;
    is_participating: boolean;
};

// フロントエンドで扱うデータ型
export type ClusterProps = {
    clusterId: string;
    clusterName: string;
    headerImage: string;
    clusterExplanation: string;
    creator: ClusterAliasProps;
    createdAt: Date; 
    participantsNumber: number;
    isParticipating: boolean;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertClusterProps = (api: ClusterApiProps): ClusterProps => {
    return {
        clusterId: api.cluster_id,
        clusterName: api.cluster_name,
        headerImage: api.header_image,
        clusterExplanation: api.cluster_explanation,
        creator: convertClusterAliasProps(api.creator),
        createdAt: new Date(api.created_at), 
        participantsNumber: api.participants_number,
        isParticipating: api.is_participating
    };
};
