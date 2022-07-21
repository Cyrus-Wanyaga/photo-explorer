import styles from "../styles/Home.module.css"
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useState, useEffect} from "react";

function Picture({pictureData = {}, index, gridColumn = {}, main}) {
    const [zoom, setZooming] = useState()
    let zoomStyles

    useEffect(() => {
        zoomStyles = {
            transform: 'scale(1)',
            transformOrigin: 'center',
        }
        setZooming(zoomStyles)
    }, [pictureData])

    const {setNodeRef, attributes, listeners, transition, transform, isDragging,} =
        useSortable({
            id: pictureData.id
        })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? '10' : '1',
        opacity: isDragging ? '0.5' : '1',
        gridColumn: index % 2 === 0 && index % 3 !== 0 ? gridColumn.modulus2Div : index % 3 === 0 ? gridColumn.modulus3Div : 'span 1',
    };

    if (!main) {
        style.height = gridColumn.height
        style.width = gridColumn.width
        style.minHeight = gridColumn.height
        style.maxHeight = gridColumn.height
    }

    const mouseInDiv = (event) => {
        event.preventDefault()
        const height = event.target.height
        const width = event.target.width
        if (event.nativeEvent.layerX > width / 2 && event.nativeEvent.layerY < height / 2) {
            console.log("Top right")
            zoomStyles = {
                transform: 'scale(2)',
                transformOrigin: 'top right'
            }
        } else if (event.nativeEvent.layerX < width / 2 && event.nativeEvent.layerY < height / 2) {
            console.log("Top left")
            zoomStyles = {
                transform: 'scale(2)',
                transformOrigin: 'top left'
            }
        } else if (event.nativeEvent.layerX > width / 2 && event.nativeEvent.layerY > height / 2) {
            console.log("Bottom right")
            zoomStyles = {
                transform: 'scale(2)',
                transformOrigin: 'bottom right'
            }
        } else if (event.nativeEvent.layerX < width / 2 && event.nativeEvent.layerY > height / 2) {
            console.log("Bottom left")
            zoomStyles = {
                transform: 'scale(2)',
                transformOrigin: 'bottom left'
            }
        }
        setZooming(zoomStyles)
    }

    const mouseOutDiv = (event) => {
        event.preventDefault()
        zoomStyles = {
            transform: 'scale(1)',
            transformOrigin: 'center'
        }

        setZooming(zoomStyles)
    }

    const zoomInStyles = (event) => {
        console.log("Clicked")
        // event.preventDefault()
        // console.log(event.target)
    }

    const zoomIn = (event) => {
        event.preventDefault()
        zoomStyles = {
            transform: 'scale(2)',
            transformOrigin: 'center'
        }
        setZooming(zoomStyles)
    }

    return (
        <div className={styles.picture_div + " picture_div"}
             ref={setNodeRef}
             style={style}
             {...listeners}
             {...attributes}
            // onMouseMove={mouseInDiv}
             onMouseEnter={main ? zoomIn : () => {}}
             onMouseLeave={main ? mouseOutDiv : () => {}}
             id={pictureData.id}>
            <img className={styles.picture_div_img} src={pictureData.urls.regular} alt={""} style={zoom}
                 loading={"lazy"}/>
            {main && <>
                <div className={styles.picture_div_info} onClick={zoomInStyles}>
                    <div className={styles.picture_div_info_bg} data-position="top-right">
                        <span className="material-symbols-rounded">person</span>
                    </div>
                </div>
                <div className={styles.picture_div_info}>
                    <div className={styles.picture_div_info_bg}>
                        <span className="material-symbols-rounded">show_chart</span>
                    </div>
                </div>
                <div className={styles.picture_div_info}>
                    <div className={styles.picture_div_info_bg}>
                        <span className="material-symbols-rounded">123</span>
                    </div>
                </div>
            </>}
            {/*<div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0', zIndex: '1', padding: '16px'}}>*/}
            {/*     <div style={{display: 'flex', alignItems: 'center'}}>*/}
            {/*         <img src={pictureData.user.profile_image.medium} alt={""} style={{width: '40px', height: '40px', objectFit: 'contain', borderRadius: '50%'}}/>*/}
            {/*         <p style={{margin: '0 0 0 16px'}}>{pictureData.user.name}</p>*/}
            {/*     </div>*/}
            {/*     <p></p>*/}
            {/* </div>*/}
        </div>
    )
}

export default Picture