export const defaultArrowStyles = {
    upStyle: {
        margin: '0 0 48px 0'
    }, downStyle: {
        margin: '32px 0 0 0'
    }
}

export const defaultPictureLayoutStyles = {
    mainDiv: {
        gridTemplateColumns: '1fr 1fr'
    },
    modulus2Div: 'span 1',
    modulus3Div: 'span 1'
}

export const defaultDifficultyConfigs = {
    easy: {
        gridTemplateColumns: '1fr 1fr',
        gridRow: 'span 1',
        gridColumn: 'span 1',
        results: 4
    },
    medium: {
        gridTemplateColumns: '1fr 1fr 1fr',
        gridColumn: 'span 1',
        results: 9
    },
    master: {
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        modulus2Div: 'span 2',
        modulus3Div: 'span 1',
        results: 16
    }
}