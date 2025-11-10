//EyesHomeMemoriesコンポーネントを作成

import styles from 'src/styles/EyesHomeMemories.module.css'


const EyesHomeMemories: React.FC = () => {

    return (
        <>
            <div className={styles.eyes_home_memories_wrapper}>
                <div className={styles.memories_wrapper}>
                    <div className={styles.account_info}>
                        <button className={styles.account_icon}></button>

                        <button className={styles.account_name}>Amane7</button>
                    </div>

                    <div className={styles.memories_display}>
                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>7m</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>59m</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>13:00</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>12/25</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>2023 12/25</span>
                        </div>
                    </div>
                </div>

                <div className={styles.memories_wrapper}>
                    <div className={styles.account_info}>
                        <button className={styles.account_icon}></button>

                        <button className={styles.account_name}>Amane7</button>
                    </div>

                    <div className={styles.memories_display}>
                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>7m</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>59m</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>13:00</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>12/25</span>
                        </div>

                        <div className={styles.memories}>
                            <button className={styles.memories_image}>
                            </button>

                            <span>2023 12/25</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default EyesHomeMemories;