import { Cloudinary } from "@cloudinary/url-gen"
import { AdvancedImage } from "@cloudinary/vue";
import { fill } from "@cloudinary/url-gen/actions/resize";

// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
    cloud: {
        cloudName: "djrnf9wmw",
        apiKey: '788766331979877',
        apiSecret: 'I3akY5Ph3G3CrOLrPdrGJS21iZ4'
    },
})

// Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
function getImage(publicId, resize = { width: null, height: null }) {
    const cldImage = cld.image(publicId)

    if (resize.width || resize.height) {
        const format = fill()
        if (resize.width) {
            format.width(resize.width)
        }
        if (resize.height) {
            format.height(resize.height)
        }
        cldImage.resize(format)
    }

    return cldImage
}

function getImageUrl(publicId, resize = { width: null, height: null }) {
    return getImage(publicId, resize).toURL()
}

export default {
    cld, 
    getImage, getImageUrl
}