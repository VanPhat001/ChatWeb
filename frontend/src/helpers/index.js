const objArray = [
    { value: 1000 * 60 * 60 * 24 * 30 * 365, str: 'năm' },
    { value: 1000 * 60 * 60 * 24 * 30, str: 'tháng' },
    { value: 1000 * 60 * 60 * 24, str: 'ngày' },
    { value: 1000 * 60 * 60, str: 'giờ' },
    { value: 1000 * 60, str: 'phút' },
    { value: 1000, str: 'giây' },
]

function getDifferenceBetween2Date(date1, date2) {
    let count = Math.abs(date1 - date2)

    for (let i = 0; i < objArray.length; i++) {
        const { value, str } = objArray[i]
        if (count >= value) {
            return `${Math.floor(count / value)} ${str} trước`
        }
    }
}

export {
    getDifferenceBetween2Date
}