import styles from "../styles/Navbar.module.css";
import pieChart from "../public/piechart.png"
import Image from "next/image";

export default function NavbarDropdown() {

    return (
        <div className={styles.navbar_dropdown}>
            <div className={styles.navbar_dropdown_holder}>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={pieChart} alt={""} width={"32"} height={"32"}/>
                    <p>Stats</p>
                </div>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={pieChart} alt={""} width={"32"} height={"32"}/>
                    <p>Community</p>
                </div>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={pieChart} alt={""} width={"32"} height={"32"}/>
                    <p>Profile</p>
                </div>
                <div className={styles.navbar_dropdown_div}>
                    <Image src={pieChart} alt={""} width={"32"} height={"32"}/>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}