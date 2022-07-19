import styles from '../styles/Home.module.css';
import Layout from "../components/Layout";
import {useEffect, createRef, useState} from "react";
import Splide from "@splidejs/splide";
import {closestCenter, DndContext, PointerSensor, useSensor, useDroppable, useDraggable} from "@dnd-kit/core";
import {arraySwap, SortableContext, rectSwappingStrategy} from "@dnd-kit/sortable";
import Picture from "../components/Picture";
import {searchOptions} from "../libs/searchTerms";
import Navbar from "../components/Navbar";
import LayoutOptions from "../components/LayoutOptions";
import DifficultyOptions from "../components/DifficultyOptions";
import {defaultArrowStyles, defaultPictureLayoutStyles, defaultDifficultyConfigs} from "../libs/constants";
import MobileNavbar from "../components/MobileNavbar";
import anime from "animejs";

let splide

export default function Home() {
    const sliderRef = createRef()
    const upButtonRef = createRef()
    const downButtonRef = createRef()
    const layoutOptionsRef = createRef()
    const difficultyOptionsRef = createRef()

    const querystring = require('query-string');
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [resultsCount, setResultsCount] = useState(12);
    const [openMobileNav, setOpenMobileNav] = useState(false);

    const [arrowStyles, setArrowStyles] = useState({upStyle: {}, downStyle: {}});
    const [pictureLayoutStyles, setPictureLayoutStyles] = useState({});
    const [sideContainerStyles, setSideContainerStyles] = useState({});

    const [pictures, setPictures] = useState(null);
    const [difficulty, setDifficulty] = useState({})
    const [layoutOptions, setLayoutOptions] = useState(false);
    const [difficultyOptions, setDifficultyOptions] = useState(false);
    const {isOver, setNodeRef} = useDroppable({
        id: 'droppable_section'
    });

    const sensors = [useSensor(PointerSensor)]

    const {attributes, listeners, draggableNodeRef, transform} = useDraggable({})

    useEffect(() => {
        const resizeNavBar = () => {
            // if (document.documentElement.scrollTop > 32) {
            //     setSideContainerStyles({top: '32px'})
            // } else if (document.documentElement.scrollTop < 32) {
            //     if (difficultyOptions) {
            //         const difficultyOptionsDivHeight = difficultyOptionsRef.current.height
            //         const newHeight = parseInt(difficultyOptionsDivHeight) + 112
            //         const topValue = newHeight.toString() + 'px'
            //         setSideContainerStyles({top: topValue})
            //     } else if (layoutOptions) {
            //         const difficultyOptionsDivHeight = layoutOptionsRef.current.height
            //         const newHeight = parseInt(difficultyOptionsDivHeight) + 112
            //         const topValue = newHeight.toString() + 'px'
            //         setSideContainerStyles({top: topValue})
            //     } else {
            //         setSideContainerStyles({top: '112px'})
            //     }
            // }
        }

        // window.addEventListener("scroll", resizeNavBar)
        // return () => window.removeEventListener("scroll", resizeNavBar)
    }, [])
    useEffect(() => {
        setArrowStyles(defaultArrowStyles)
        setPictureLayoutStyles(defaultPictureLayoutStyles)
        setDifficulty(defaultDifficultyConfigs)

        splide = new Splide('.splide', {
            direction: 'ttb',
            perPage: 1,
            perMove: 1,
            arrows: false,
            height: '67px',
            focus: 'center',
            wheel: true,
            pagination: false,
            autoHeight: true,
            autoWidth: true,
            gap: '16px'
        })
        splide.mount()

        fetchPictures(page)
    }, [])

    useEffect(() => {
        splide.on('move', () => {
            if (splide.index === splide.length - 1) {
                setArrowStyles({
                    upStyle: {
                        margin: '0 0 32px 0'
                    },
                    downStyle: {
                        margin: '48px 0 0 0'
                    }
                })
            } else if (splide.index !== 0 && splide.index < splide.length - 1) {
                setArrowStyles({
                    upStyle: {
                        margin: '0 0 48px 0'
                    },
                    downStyle: {
                        margin: '48px 0 0 0'
                    }
                })
            } else if (splide.index === 0) {
                setArrowStyles({
                    upStyle: {
                        margin: '0 0 48px 0'
                    },
                    downStyle: {
                        margin: '32px 0 0 0'
                    }
                })
            }
        })
    }, [])

    const fetchPictures = (searchPage) => {
        let myHeaders = new Headers();
        myHeaders.append("Accept-Version", "v1");
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const params = querystring.stringify({
            client_id: '2znQTIjpVDrJjMYs8emfPFVkwHtb4wl7DGo3gkY-6Sw',
            page: searchPage,
            per_page: resultsCount,
        })

        fetch("https://api.unsplash.com/photos/?" + params, requestOptions)
            .then(response => response.text())
            .then(result => {
                setPictures(JSON.parse(result))
            })
            .catch(error => console.log('error', error));
    }

    const changePictureCategory = (event) => {
        event.preventDefault()
        const searchTerm = event.target.innerHTML

        setSearchTerm(searchTerm)
        reloadPicturesWithNewParams(searchTerm, 1)
    }

    const reloadPicturesWithNewParams = (term, searchPage) => {
        let myHeaders = new Headers();
        myHeaders.append("Accept-Version", "v1");
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const params = querystring.stringify({
            client_id: '2znQTIjpVDrJjMYs8emfPFVkwHtb4wl7DGo3gkY-6Sw',
            page: searchPage,
            per_page: resultsCount,
            query: term
        })

        fetch("https://api.unsplash.com/search/photos/?" + params, requestOptions)
            .then(response => response.text())
            .then(result => {
                const pictures = JSON.parse(result)
                setPictures(pictures.results)
            })
            .catch(error => console.log('error', error));
    }

    const reloadWithDifficultySettings = (difficultyOpt) => {
        if (difficultyOpt === 'easy') {
            setResultsCount(difficulty.easy.results)
            reloadLayoutAPICall(difficulty.easy.results)
            setPictureLayoutStyles({
                mainDiv: {
                    gridTemplateColumns: difficulty.easy.gridTemplateColumns,
                },
                modulus2Div: difficulty.easy.gridColumn,
                modulus3Div: difficulty.easy.gridColumn,
            })
        } else if (difficultyOpt === 'medium') {
            setResultsCount(difficulty.medium.results)
            reloadLayoutAPICall(difficulty.medium.results)
            setPictureLayoutStyles({
                mainDiv: {
                    gridTemplateColumns: difficulty.medium.gridTemplateColumns,
                },
                modulus2Div: difficulty.medium.gridColumn,
                modulus3Div: difficulty.medium.gridColumn,
            })
        } else if (difficultyOpt === 'master') {
            setResultsCount(difficulty.master.results)
            reloadLayoutAPICall(difficulty.master.results)
            setPictureLayoutStyles({
                mainDiv: {
                    gridTemplateColumns: difficulty.master.gridTemplateColumns,
                },
                modulus2Div: difficulty.master.modulus2Div,
                modulus3Div: difficulty.master.modulus3Div,
            })
        }
        setDifficultyOptions(!difficultyOptions)
    }

    const reloadLayoutAPICall = (results) => {
        let myHeaders = new Headers();
        myHeaders.append("Accept-Version", "v1");
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const params = searchTerm === "" ? querystring.stringify({
            client_id: '2znQTIjpVDrJjMYs8emfPFVkwHtb4wl7DGo3gkY-6Sw',
            page: page,
            per_page: results,
        }) : querystring.stringify({
            client_id: '2znQTIjpVDrJjMYs8emfPFVkwHtb4wl7DGo3gkY-6Sw',
            page: page,
            per_page: results,
            query: searchTerm
        })

        const url = searchTerm === "" ? "https://api.unsplash.com/photos/?" : "https://api.unsplash.com/search/photos/?"
        fetch(url + params, requestOptions)
            .then(response => response.text())
            .then(result => {
                const pictures = JSON.parse(result)
                searchTerm === "" ? setPictures(pictures) : setPictures(pictures.results)
            })
            .catch(error => console.log('error', error));
    }

    function handleDragEnd({active, over}) {
        if (active !== null && over !== null) {
            if (active.id !== over.id) {
                setPictures((pictures) => {
                    const oldIndex = pictures.findIndex(picture => picture.id === active.id)
                    const newIndex = pictures.findIndex(picture => picture.id === over.id)

                    return arraySwap(pictures, oldIndex, newIndex)
                })
            }
        }
    }

    const loadNextPage = (event) => {
        event.preventDefault()
        const searchPage = event.target.attributes["data-page"].value
        setPage(searchPage)

        searchTerm === "" ? fetchPictures(searchPage) : reloadPicturesWithNewParams(searchTerm, searchPage)
    }

    const moveSliderDown = (event) => {
        event.preventDefault()
        splide.go('>')
    }

    const moveSliderUp = (event) => {
        event.preventDefault()
        splide.go('<')
    }

    const applyStaggerAnimation = (event) => {
        event.preventDefault()
        console.log(event.target)
        const newArray = [...pictures]
        const shuffledArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            return array
        }

        const shuffle = shuffledArray(newArray)

        let animation = anime({
            targets: '#droppable_section .picture_div',
            // scale: [
            //     {value: .1, easing: 'easeOutSine', duration: 500},
            //     {value: 1, easing: 'easeInOutQuad', duration: 1200}
            // ],
            // rotate: [
            //     {value: '360deg', easing: 'easeOutSine', duration: 500},
            //     {value: '0deg', easing: 'easeInOutQuad', duration: 1200}
            // ],
            opacity: [
                {value: 0, easing: 'easeOutSine', duration: 500},
                {value: 1, easing: 'easeInOutQuad', duration: 1200}
            ],
            delay: anime.stagger(200, {grid: [3, 4], from: 'first'}),
            begin: function () {
                setTimeout(() => {setPictures(shuffle)}, 500)
            }
        });

        animation.play()
        // setTimeout(() => {setPictures(shuffle)}, 1000)
    }

    const triggers = {
        layoutOptionsTrigger: [layoutOptions, setLayoutOptions],
        difficultyOptionsTrigger: [difficultyOptions, setDifficultyOptions],
        openMobileNavTrigger: [openMobileNav, setOpenMobileNav]
    }

    return (
        <Layout title={"Photo Explorer"}>
            <div className={""}>
                <Navbar triggers={triggers}/>
                {openMobileNav && <MobileNavbar setOpenMobileNav={setOpenMobileNav}/>}
                <LayoutOptions layoutOptions={layoutOptions} setPictureLayoutOptionsStyle={setPictureLayoutStyles}
                               ref={layoutOptionsRef}/>
                <DifficultyOptions difficultyOptions={difficultyOptions} setDifficultyOptions={setDifficultyOptions}
                                   reload={reloadWithDifficultySettings} ref={difficultyOptionsRef}/>
                <div className={styles.main_container}
                     style={!layoutOptions && !difficultyOptions ? {marginTop: '80px'} : {marginTop: '0'}}>
                    <div className={styles.side_container}>
                        <div className={styles.side_container_holder} style={sideContainerStyles}>
                            <div className={styles.slider_arrows_bg} onClick={moveSliderUp}
                                 style={arrowStyles.upStyle}><span
                                className="material-symbols-rounded">expand_less</span></div>
                            <div className={"splide"} role="group" aria-label="Splide Basic HTML Example"
                                 ref={sliderRef}>
                                <div className={"splide__track"}>
                                    <ul className={"splide__list"}>
                                        {searchOptions.sort().map((option, key) => (
                                            <li key={key} className={"splide__slide"}>
                                                <p className={styles.category_div}
                                                   onClick={changePictureCategory}>{option}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.slider_arrows_bg} onClick={moveSliderDown} ref={downButtonRef}
                                 style={arrowStyles.downStyle}><span
                                className="material-symbols-rounded">expand_more</span></div>
                        </div>
                    </div>
                    <div className={styles.middle_container} id={"droppable_section"} ref={setNodeRef}
                         style={pictureLayoutStyles.mainDiv}
                    onClick={applyStaggerAnimation}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            {pictures !== null && pictures.length > 0 ? (
                                <SortableContext items={pictures.map(picture => picture.id)}
                                                 strategy={rectSwappingStrategy}>
                                    {pictures.map((picture, key) => (
                                        <Picture pictureData={picture} index={key + 1}
                                                 gridColumn={pictureLayoutStyles}/>
                                    ))}
                                </SortableContext>
                            ) : null}
                        </DndContext>
                    </div>
                    <div className={styles.side_container}>
                        <div className={styles.side_container_holder} style={sideContainerStyles}>
                            <p className={styles.pages_div} onClick={loadNextPage} data-page={"1"}>1</p>
                            <p className={styles.pages_div} onClick={loadNextPage} data-page={"2"}>2</p>
                            <p className={styles.pages_div} onClick={loadNextPage} data-page={"3"}>3</p>
                            <p className={styles.pages_div} onClick={loadNextPage} data-page={"4"}>4</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
