import styles from "../styles/SuccessMessage.module.css"
import {useEffect} from "react";

export default function SuccessMessage({showSuccess}) {
    const hideSuccessMessage = (event) => {
        event.preventDefault()
        showSuccess(false)
    }

    return (
        <div className={styles.container} onClick={hideSuccessMessage}>
            <div className={styles.inner_div}>
                Good job...Great success
            </div>
        </div>
    )
}