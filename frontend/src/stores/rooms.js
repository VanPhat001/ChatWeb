import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoomsStore = defineStore('rooms', () => {
    const roomsMap = ref(new Map())

    function addOne(room) {
        if (!roomsMap.value.has(room._id)) {
            roomsMap.value.set(room._id, room)
        }
    }

    function addMany(roomArray) {
        roomArray.forEach(room => {
            addOne(room)  
        })
    }

    function get(roomId) {
        return roomsMap.value.get(roomId)
    }

    function contain(roomId) {
        return roomsMap.value.has(roomId)
    } 

    return {
        roomsMap, 
        addOne, addMany, get, contain
    }
})