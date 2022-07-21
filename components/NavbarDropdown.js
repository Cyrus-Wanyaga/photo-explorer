import styles from "../styles/Navbar.module.css";
import pieChart from "../public/piechart.png";
import settings from "../public/candlestick.png";
import community from "../public/users.png";
import Image from "next/image";
import {useEffect} from "react";
import anime from "animejs";

export default function NavbarDropdown() {
    useEffect(() => {
        let animation = anime({
            targets: '#dropdown',
            scale: [0,1],
            // opacity: 1,
            duration: 1500,
            delay: 3000
        })

        animation.play()
    }, [])

    return (
        <div className={styles.navbar_dropdown} id={"dropdown"}>
            <div className={styles.navbar_dropdown_holder}>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={pieChart} alt={""} width={"32"} height={"32"}/>
                    <p>Stats</p>
                </div>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={community} alt={""} width={"32"} height={"32"}/>
                    <p>Community</p>
                </div>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={settings} alt={""} width={"32"} height={"32"}/>
                    <p>Profile</p>
                </div>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={pieChart} alt={""} width={"32"} height={"32"} style={{transform: 'rotate(270deg)'}}/>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}