class Clock {
    callbacks = []

    constructor(intervalTime = 1000) {
        setInterval(() => {
            this.callbacks.forEach(func => func())
        }, intervalTime);
    }

    register(callback) {
        this.callbacks.push(callback)
    }

    unSubcribe(callback) {
        this.callbacks = this.callbacks.filter(func => func != callback)
    }
}

export default new Clock()