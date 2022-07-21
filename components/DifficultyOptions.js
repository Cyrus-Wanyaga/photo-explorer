import styles from "../styles/DifficultyOptions.module.css"
import {useEffect, useState, createRef} from "react";
import anime from "animejs";

export default function DifficultyOptions({difficultyOptions, reload}) {
    const [showDifficultyOptions, setShowDifficultyOptions] = useState(false)

    const difficultyDivRef = createRef()

    useEffect(() => {
        let animation
        if (difficultyOptions) {
            animation = anime({
                targets: difficultyDivRef.current,
                scaleY: [0, 1],
                opacity: [0, 1],
                height: ['0%', '100%'],
                easing: 'easeInOutCubic',
                duration: 200,
                // delay: 500,
            })
        } else {
            animation = anime({
                targets: difficultyDivRef.current,
                scaleY: [1, 0],
                opacity: [1, 0],
                height: ['100%', '0%'],
                easing: 'easeInOutCubic',
                duration: 200,
                // delay: 500,
            })
        }

        animation.play()

        setShowDifficultyOptions(difficultyOptions)
    }, [difficultyOptions])

    const setEasyDifficulty = (event) => {
        event.preventDefault()
        reload('easy')
    }

    const setMediumDifficulty = (event) => {
        event.preventDefault()
        reload('medium')
    }

    const setMasterDifficulty = (event) => {
        event.preventDefault()
        reload('master')
    }

    return (
        <div className={styles.difficulty_options_div}
             style={showDifficultyOptions ? {display: 'flex'} : {display: 'none'}}
             ref={difficultyDivRef}>
            <div className={styles.difficulty_options_select_div}>
                <div className={styles.difficulty_options_select_inner_div} onClick={setEasyDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <div className={styles.difficulty_options_select_inner_div} onClick={setEasyDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <p>Easy</p>
            </div>
            <div className={styles.difficulty_options_select_div}>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMediumDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMediumDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMediumDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <p>Medium</p>
            </div>
            <div className={styles.difficulty_options_select_div}>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMasterDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMasterDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMasterDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <div className={styles.difficulty_options_select_inner_div} onClick={setMasterDifficulty}>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                    <div className={styles.difficulty_options_shape}/>
                </div>
                <p>Master</p>
            </div>
        </div>
    )
}