const objArray = [
    { value: 1000 * 60 * 60 * 24 * 30 * 365, str: 'năm' },
    { value: 1000 * 60 * 60 * 24 * 30, str: 'tháng' },
    { value: 1000 * 60 * 60 * 24, str: 'ngày' },
    { value: 1000 * 60 * 60, str: 'giờ' },
    { value: 1000 * 60, str: 'phút' },
    { value: 1000, str: 'giây' },
]

function getDifferenceBetween2Date(date1, date2) {
    const mSecond = Math.abs(date1 - date2)
    return convertMillisecondsToTime(mSecond)
}

function convertMillisecondsToTime(mSecond) {
    for (let i = 0; i < objArray.length; i++) {
        const { value, str } = objArray[i]
        if (mSecond >= value) {
            return `${Math.floor(mSecond / value)} ${str} trước`
        }
    }
    return 'vừa xong'
}

function uploadFileToCloudinary(callback) {
    const myWidget = cloudinary.createUploadWidget({
        cloudName: 'djrnf9wmw',
        uploadPreset: 'top5opph'
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            // console.log('Done! Here is the image info: ', result.info);
            callback(result)
        }
    })
    myWidget.open()
}

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

export {
    getDifferenceBetween2Date,
    convertMillisecondsToTime,
    uploadFileToCloudinary,
    isValidHttpUrl
}