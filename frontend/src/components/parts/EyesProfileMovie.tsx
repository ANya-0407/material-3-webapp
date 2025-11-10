//EyesProfileMovieコンポーネントを作成

import { EyesProfilePageInfoProps } from "src/types";
import styles from 'src/styles/EyesProfileMovie.module.css'


type ProfileProps = {
    profile: EyesProfilePageInfoProps | null | undefined;
};


const EyesProfileMovie: React.FC<ProfileProps> = ({ profile }) => {

    return (
        <>
            <div className={styles.eyes_profile_movie_wrapper}>

            </div>
        </>
    )
};

export default EyesProfileMovie;