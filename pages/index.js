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
import ExpectedSolution from "../components/ExpectedSolution";
import SuccessMessage from "../components/SuccessMessage";

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
    const [resultsCount, setResultsCount] = useState();
    const [openMobileNav, setOpenMobileNav] = useState(false);
    const [showExpectedSolution, setShowExpectedSolution] = useState(true);
    const [solved, setSolved] = useState(false)

    const [arrowStyles, setArrowStyles] = useState({upStyle: {}, downStyle: {}});
    const [pictureLayoutStyles, setPictureLayoutStyles] = useState({});
    const [sideContainerStyles, setSideContainerStyles] = useState({});

    const [pictures, setPictures] = useState(null);
    const [originalPictures, setOriginalPictures] = useState(null);
    const [difficulty, setDifficulty] = useState({});
    const [layoutOptions, setLayoutOptions] = useState(false);
    const [difficultyOptions, setDifficultyOptions] = useState(false);
    const {isOver, setNodeRef} = useDroppable({
        id: 'droppable_section'
    });

    const sensors = [useSensor(PointerSensor)]

    const {attributes, listeners, draggableNodeRef, transform} = useDraggable({})

    //Load difficulty settings
    useEffect(() => {
        showExpectedSolution ? document.body.parentElement.style.overflowY = "hidden" : null
        const loadConfigs = () => {
            setDifficulty(defaultDifficultyConfigs)
            setArrowStyles(defaultArrowStyles)

            if (localStorage.getItem("level") !== undefined && localStorage.getItem("level") !== null) {
                if (localStorage.getItem("level") === "easy") {
                    setResultsCount(defaultDifficultyConfigs.easy.results)
                    setPictureLayoutStyles({
                        mainDiv: {
                            gridTemplateColumns: defaultDifficultyConfigs.easy.gridTemplateColumns,
                        },
                        modulus2Div: defaultDifficultyConfigs.easy.gridColumn,
                        modulus3Div: defaultDifficultyConfigs.easy.gridColumn,
                    })
                } else if (localStorage.getItem("level") === "medium") {
                    setResultsCount(defaultDifficultyConfigs.medium.results)
                    setPictureLayoutStyles({
                        mainDiv: {
                            gridTemplateColumns: defaultDifficultyConfigs.medium.gridTemplateColumns,
                        },
                        modulus2Div: defaultDifficultyConfigs.medium.gridColumn,
                        modulus3Div: defaultDifficultyConfigs.medium.gridColumn,
                    })
                } else if (localStorage.getItem("level") === "master") {
                    setResultsCount(defaultDifficultyConfigs.master.results)
                    setPictureLayoutStyles({
                        mainDiv: {
                            gridTemplateColumns: defaultDifficultyConfigs.master.gridTemplateColumns,
                        },
                        modulus2Div: defaultDifficultyConfigs.master.modulus2Div,
                        modulus3Div: defaultDifficultyConfigs.master.modulus3Div,
                    })
                }
            } else {
                setResultsCount(4)
                setPictureLayoutStyles(defaultPictureLayoutStyles)
            }
        }

        loadConfigs()
        resultsCount !== undefined ? fetchPictures(page) : () => {}
    }, [resultsCount])

    useEffect(() => {
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
    }, [])

    useEffect(() => {
        !showExpectedSolution ? document.body.parentElement.style.overflowY = "scroll" : document.body.parentElement.style.overflowY = "hidden"
    }, [showExpectedSolution])

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
                setOriginalPictures(JSON.parse(result))
                const shuffled = shuffledArray(JSON.parse(result))
                setPictures(...[shuffled])
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
                setOriginalPictures(JSON.parse(result).results)
                const shuffled = shuffledArray(JSON.parse(result).results)
                setPictures(...[shuffled])
                setShowExpectedSolution(true)
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
            localStorage.setItem("level", "easy")
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
            localStorage.setItem("level", "medium")
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
            localStorage.setItem("level", "master")
        }
        setDifficultyOptions(!difficultyOptions)
        setShowExpectedSolution(true)
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
                if (searchTerm === "") {
                    setOriginalPictures(JSON.parse(result));
                    const shuffled = shuffledArray(JSON.parse(result));
                    setPictures(...[shuffled]);
                } else {
                    setOriginalPictures(JSON.parse(result).results)
                    const shuffled = shuffledArray(JSON.parse(result).results);
                    setPictures(...[shuffled]);
                }
            })
            .catch(error => console.log('error', error));
        setShowExpectedSolution(true)
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

    useEffect(() => {
        checkIfSolved()
    }, [pictures])

    const checkIfSolved = () => {
        if (pictures !== null && originalPictures !== null) {
            let solved
            for (let x = 0; x < originalPictures.length; x++) {
                if (originalPictures[x].id === pictures[x].id) {
                    solved = true
                } else {
                    solved = false
                    break
                }
            }
            setSolved(solved)
        }
    }

    const loadNextPage = (event) => {
        event.preventDefault()
        const searchPage = event.target.attributes["data-page"].value
        setPage(searchPage)

        searchTerm === "" ? fetchPictures(searchPage) : reloadPicturesWithNewParams(searchTerm, searchPage)
        setShowExpectedSolution(true)
    }

    const moveSliderDown = (event) => {
        event.preventDefault()
        splide.go('>')
    }

    const moveSliderUp = (event) => {
        event.preventDefault()
        splide.go('<')
    }

    function shuffledArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array
    }

    const applyStaggerAnimation = (event) => {
        event.preventDefault()
        const newArray = [...pictures]
        const shuffledPictures = shuffledArray(newArray)

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
                setTimeout(() => {
                    setPictures(shuffledPictures)
                }, 500)
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

    const randomizeChallenge = () => {
        const index = Math.floor(Math.random() * searchOptions.length)
        console.log("Index is " + index)
        const selectedSearchTerm = searchOptions[index]
        const page = Math.floor(Math.random() * 10) + 1
        console.log("Search term is " + selectedSearchTerm)
        console.log("Page is " + page)
        setSearchTerm(selectedSearchTerm)
        setPage(page)


    }

    return (
        <Layout title={"Photo Explorer"}>
            <div className={""} style={{position: 'relative'}}>
                {solved && <SuccessMessage showSuccess={setSolved} loadNewChallenge={randomizeChallenge}/>}
                {showExpectedSolution &&
                    <ExpectedSolution showExpectedSolution={setShowExpectedSolution} pictures={originalPictures}
                                      layoutStyles={pictureLayoutStyles}/>}
                <Navbar triggers={triggers}/>
                {openMobileNav && <MobileNavbar setOpenMobileNav={setOpenMobileNav}/>}
                <LayoutOptions layoutOptions={layoutOptions} setPictureLayoutOptionsStyle={setPictureLayoutStyles}
                               ref={layoutOptionsRef}/>
                <DifficultyOptions difficultyOptions={difficultyOptions} reload={reloadWithDifficultySettings}
                                   ref={difficultyOptionsRef}/>
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
                                        <Picture key={key} pictureData={picture} index={key + 1}
                                                 gridColumn={pictureLayoutStyles} main={true}/>
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
