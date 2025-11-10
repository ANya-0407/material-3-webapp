//EyesProfileStoreコンポーネントを作成

import { EyesProfilePageInfoProps } from "src/types";
import styles from 'src/styles/EyesProfileBoard.module.css'


type ProfileProps = {
    profile: EyesProfilePageInfoProps | null | undefined;
};


const EyesProfileBoard: React.FC<ProfileProps> = ({ profile }) => {

    return (
        <>
            <div className={styles.eyes_profile_board_wrapper}>

            </div>
        </>
    )
};

export default EyesProfileBoard;