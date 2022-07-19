import styles from "../styles/MobileNavbar.module.css";

export default function MobileNavbar({setOpenMobileNav}) {
    const closeMobileNavbar = (event) => {
        event.preventDefault()
        setOpenMobileNav(false)
    }

    return (
        <div className={styles.mobile_navbar}>
            <div className={styles.mobile_navbar_div}>
                <div className={styles.mobile_navbar_div_inner}>
                    <span className={styles.mobile_navbar_div_inner_span + " material-symbols-rounded"} onClick={closeMobileNavbar}>close</span>
                </div>
                <div className={styles.mobile_navbar_div_inner}>
                    <span className={styles.mobile_navbar_div_inner_span + " material-symbols-rounded"}>chevron_left</span>
                    <p>Layout</p>
                </div>
                <div className={styles.mobile_navbar_div_inner}>
                    <span className={styles.mobile_navbar_div_inner_span + " material-symbols-rounded"}>chevron_left</span>
                    <p>Difficulty</p>
                </div>
                <div className={styles.mobile_navbar_div_inner}>
                    <span className={styles.mobile_navbar_div_inner_span + " material-symbols-rounded"}>chevron_left</span>
                    <p>Account</p>
                </div>
                <div className={styles.mobile_navbar_div_inner}>
                    <span className={styles.mobile_navbar_div_inner_span + " material-symbols-rounded"}>chevron_left</span>
                    <p>Stats</p>
                </div>
            </div>
        </div>
    )
}