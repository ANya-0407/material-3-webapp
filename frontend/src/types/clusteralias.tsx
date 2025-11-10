// API から受け取るデータ型
export type ClusterAliasApiProps = {
    alias_id: string;
    alias_name: string;
    alias_icon: string;
};

// フロントエンドで扱うデータ型
export type ClusterAliasProps = {
    aliasId: string;
    aliasName: string;
    aliasIcon: string;
};

// APIレスポンスをフロントエンド用に変換する関数
export const convertClusterAliasProps = (api: ClusterAliasApiProps): ClusterAliasProps => {
    return {
        aliasId: api.alias_id,
        aliasName: api.alias_name,
        aliasIcon: api.alias_icon
    };
};


