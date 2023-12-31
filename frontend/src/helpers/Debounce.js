class Debounce {
    #timeOut = 300
    #id = null
    #callback = () => {}

    constructor(callback, timeOut = 300) {
        this.#callback = callback
        this.#timeOut = timeOut
    }

    reStart() {
        clearTimeout(this.#id)
        this.#id = setTimeout(() => {
            this.#callback()
        }, this.#timeOut)
    }
}

export default Debounce