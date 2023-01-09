const PERCENT_DECIMALS = 2

export const formatPercent = (num: number) => (num * 100).toFixed(PERCENT_DECIMALS) + '%'

export const formatSecondsToMinSec = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const minSeconds = (seconds % 60).toString().padStart(2, '0')

    return `${minutes}:${minSeconds}`
}