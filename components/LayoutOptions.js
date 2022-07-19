import styles from "../styles/LayoutOptions.module.css";
import {useEffect, useState, createRef} from "react";
import anime from "animejs";

export default function LayoutOptions({layoutOptions, setPictureLayoutOptionsStyle}) {
    const [showLayouts, setShowLayouts] = useState(false)

    const layoutDivRef = createRef()

    useEffect(() => {
        let animation
        if (layoutOptions) {
            animation = anime({
                targets: layoutDivRef.current,
                scaleY: [0, 1],
                opacity: [0, 1],
                height: ['0%', '100%'],
                easing: 'easeInOutCubic',
                duration: 200,
                // delay: 500,
            })
        } else {
            animation = anime({
                targets: layoutDivRef.current,
                scaleY: [1, 0],
                opacity: [1, 0],
                height: ['100%', '0%'],
                easing: 'easeInOutCubic',
                duration: 200,
                // delay: 500,
            })
        }

        animation.play()
        setShowLayouts(layoutOptions)
    }, [layoutOptions])

    const changeLayoutTo2By2 = (event) => {
        event.preventDefault()
        setPictureLayoutOptionsStyle({
            mainDiv: {
                gridTemplateColumns: '1fr 1fr'
            },
            modulus2Div: 'span 1',
            modulus3Div: 'span 1'
        })
    }

    const changeLayoutTo4By2 = (event) => {
        event.preventDefault()
        setPictureLayoutOptionsStyle({
            mainDiv: {
                gridTemplateColumns: '1fr 1fr 1fr 1fr'
            },
            modulus2Div: 'span 2',
            modulus3Div: 'span 1'
        })
    }

    return (
        <div className={styles.layout_div} ref={layoutDivRef}
             style={showLayouts ? {display: 'flex'} : {display: 'none'}}>
            <div className={styles.layout_select_div}>
                <div className={styles.layout_select_holder_div}>
                    <div className={styles.layout_select_inner_div} onClick={changeLayoutTo2By2}>
                        <div className={styles.layout_select_div_shape}/>
                        <div className={styles.layout_select_div_shape}/>
                    </div>
                    <div className={styles.layout_select_inner_div} onClick={changeLayoutTo2By2}>
                        <div className={styles.layout_select_div_shape}/>
                        <div className={styles.layout_select_div_shape}/>
                    </div>
                    <p>2 x 2</p>
                </div>
            </div>
            <div className={styles.layout_select_div}>
                <div className={styles.layout_select_holder_div}>
                    <div className={styles.layout_select_inner_div} onClick={changeLayoutTo4By2}>
                        <div className={styles.layout_select_div_shape}/>
                        <div className={styles.layout_select_div_shape}/>
                        <div className={styles.layout_select_div_shape}/>
                    </div>
                    <div className={styles.layout_select_inner_div} onClick={changeLayoutTo4By2}>
                        <div className={styles.layout_select_div_shape}/>
                        <div className={styles.layout_select_div_shape}/>
                        <div className={styles.layout_select_div_shape}/>
                    </div>
                    <p>3 x n</p>
                </div>
            </div>
        </div>
    )
}