import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoomsStore = defineStore('rooms', () => {
    const roomMap = ref(new Map())

    function addOne(room) {
        if (!roomMap.value.has(room._id)) {
            roomMap.value.set(room._id, room)
        }
    }

    function addMany(roomArray) {
        roomArray.forEach(room => {
            addOne(room)  
        })
    }

    function get(roomId) {
        return roomMap.value.get(roomId)
    }

    function contain(roomId) {
        return roomMap.value.has(roomId)
    } 

    return {
        roomMap, 
        addOne, addMany, get, contain
    }
})