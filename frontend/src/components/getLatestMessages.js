import axios from '@/axiosConfig';
import { roomId } from './BoxChat.vue';

export function getLatestMessages(limit = 20) {
return await axios.get(`/room/${roomId}`);

}
