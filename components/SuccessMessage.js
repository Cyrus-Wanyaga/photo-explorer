import styles from "../styles/SuccessMessage.module.css"
import {useEffect, createRef} from "react";
import anime from "animejs";

export default function SuccessMessage({showSuccess, loadNewChallenge}) {
    const firstCardRef = createRef()
    const secondCardRef = createRef()
    const thirdCardRef = createRef()
    const fourthCardRef = createRef()

    let movingAnimation

    useEffect(() => {
         movingAnimation = anime({
            targets: [firstCardRef.current, secondCardRef.current, thirdCardRef.current, fourthCardRef.current],
            scale: [{value: '.1', easing: 'easeOutSine', duration: 500}, {value: '1', easing: 'easeInOutQuad', duration: 500}],
            border: [{value: '2px solid rebeccapurple', easing: 'easeOutSine', duration: 1200}, {value: '2px solid white', easing: 'easeInOutQuad', duration: 1200}],
            // rotate: ['0deg', '360deg'],
            duration: 1000,
            loop: 3,
            easing: 'easeInOutQuad',
            delay: anime.stagger(200),
            complete: function () {
              this.border = {value: '2px solid transparent'}
            },
        })
    }, [])

    const hideSuccessMessage = (event) => {
        event.preventDefault()
        showSuccess(false)
    }

    const playAnimation = () => {
        movingAnimation !== undefined ? movingAnimation.play() : null
    }

    const shuffleGrid = (event) => {
        event.preventDefault()
        loadNewChallenge()
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner_div}>
                <div className={styles.close_icon_div}>
                    <span className="material-symbols-rounded" onClick={hideSuccessMessage}>close</span>
                </div>
                <div className={styles.content_div} onMouseEnter={playAnimation}>
                    <h3>Great...you did it</h3>
                    <div className={styles.mock_grid_div}>
                        <div className={styles.mock_picture_card} ref={firstCardRef}/>
                        <div className={styles.mock_picture_card} ref={secondCardRef}/>
                        <div className={styles.mock_picture_card} ref={thirdCardRef}/>
                        <div className={styles.mock_picture_card} ref={fourthCardRef}/>
                    </div>
                </div>
                <div className={styles.button_div}>
                    <button className={""} onClick={() => loadNewChallenge()}>Randomize<span className={styles.button_div_span + " material-symbols-rounded"}>casino</span></button>
                </div>
            </div>
        </div>
    )
}