import styles from "../styles/Navbar.module.css";
import Image from "next/image";
import logo from "../public/upload.png"
import {useState, useEffect} from "react";
import NavbarDropdown from "./NavbarDropdown";

export default function Navbar({triggers = {}}) {
    const [navbarStyles, setNavbarStyles] = useState({})
    const [dropdownStyles, setDropdownStyles] = useState({})
    const [displayDropdown, setDisplayDropdown] = useState(false)

    useEffect(() => {
        const resizeNavBar = () => {
            if (document.documentElement.scrollTop > 32) {
                setNavbarStyles({top: '-80px'})
            } else if (document.documentElement.scrollTop < 32) {
                setNavbarStyles(null)
            }
        }

        window.addEventListener("scroll", resizeNavBar)
        return () => window.removeEventListener("scroll", resizeNavBar)
    }, [])

    const openLayoutDiv = (event) => {
        event.preventDefault()
        if (triggers.difficultyOptionsTrigger[0]) {
            triggers.difficultyOptionsTrigger[1](false)
        }
        triggers.layoutOptionsTrigger[1](!triggers.layoutOptionsTrigger[0])
    }

    const openDifficultyDiv = (event) => {
        event.preventDefault()
        if (triggers.layoutOptionsTrigger[0]) {
            triggers.layoutOptionsTrigger[1](false)
        }
        triggers.difficultyOptionsTrigger[1](!triggers.difficultyOptionsTrigger[0])
    }

    const openMobileMenu = (event) => {
        event.preventDefault()
        triggers.openMobileNavTrigger[1](!triggers.openMobileNavTrigger[0])
    }

    return (
        <div className={styles.navbar} style={navbarStyles}>
            <div className={styles.navbar_brand}>
                <Image src={logo} height={'32px'} width={'32px'} className={styles.navbar_brand_img}/>
                <h2>Photographic Memory</h2>
            </div>
            <div className={styles.navbar_links}>
                <p onClick={openLayoutDiv}>Layout</p>
                <p onClick={openDifficultyDiv}>Difficulty</p>
                <p className={styles.navbar_link_with_dropdown} onMouseEnter={() => setDisplayDropdown(true)} onMouseLeave={() => {setDisplayDropdown(false)}}>Account
                    {displayDropdown && <NavbarDropdown/>}
                </p>
                {/*<span className={"material-symbols-rounded"}>apps</span>*/}
            </div>
            <span className={styles.navbar_mobile_toggle + " material-symbols-rounded"}
                  onClick={openMobileMenu}>apps</span>
        </div>
    )
}