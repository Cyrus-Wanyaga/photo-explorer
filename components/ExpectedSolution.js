import styles from "../styles/ExpectedSolution.module.css"
import {rectSwappingStrategy, SortableContext} from "@dnd-kit/sortable";
import Picture from "./Picture";
import {useEffect} from "react";

export default function ExpectedSolution({showExpectedSolution, pictures = [], layoutStyles}) {
    useEffect(() => {
        const setNewHeightAndWidth = () => {
            layoutStyles.height = "200px"
            layoutStyles.width = "200px"
        }

        setNewHeightAndWidth()
    }, [layoutStyles])

    const hideExpectedSolution = (event) => {
        event.preventDefault()
        showExpectedSolution(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner_div}>
                <div className={styles.close_btn_div}>
                    <span className="material-symbols-rounded" onClick={hideExpectedSolution}>close</span>
                </div>
                <div className={styles.instructions_div}>
                    <p>Your solution should look like the grid below. All the best!</p>
                </div>
                <div className={styles.expected_solution_div} style={layoutStyles.mainDiv}>
                    {pictures !== null && pictures.length > 0 ? (<>{pictures.map((picture, key) => (
                        <Picture pictureData={picture} index={key + 1}
                                 gridColumn={layoutStyles} main={false}/>
                    ))}</>) : null}
                </div>
                <div className={styles.start_game_div}>
                    <button className={styles.start_game_btn} onClick={hideExpectedSolution}>Start</button>
                </div>
            </div>
        </div>
    )
}