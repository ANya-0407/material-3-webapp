//EyesProfileMemoriesコンポーネントを作成

import { EyesProfilePageInfoProps } from "src/types";
import styles from 'src/styles/EyesProfileMemories.module.css'


type ProfileProps = {
    profile: EyesProfilePageInfoProps | null | undefined;
};


const EyesProfileMemories: React.FC<ProfileProps> = ({ profile }) => {

    return (
        <>
            <div className={styles.eyes_profile_memories_wrapper}>

            </div>
        </>
    )
};

export default EyesProfileMemories;