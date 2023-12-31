<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton
                class="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset hover:bg-gray-700">
                {{ title }}
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="p-1 overflow-hidden">
                    <MenuItem v-slot="{ active }" v-for="(item, index) in itemList" :key="index">
                    <button @click="selectItem(index)"
                        :class="[active ? 'bg-gray-400' : 'bg-gray-600', 'block px-4 py-2 text-sm w-full']">{{
                            item }}</button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>
  
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { computed } from 'vue';

const emits = defineEmits(['onSelectItem'])
const props = defineProps({
    title: {
        type: String,
        default: 'title'
    },
    itemList: {
        type: Array,
        default: []
    }
})

const title = computed(() => props.title)
const itemList = computed(() => props.itemList)

function selectItem(index) {
    emits('onSelectItem', { index })
}
</script>