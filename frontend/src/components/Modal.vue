<template>
    <div class="modal relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!--
          Background backdrop, show/hide based on modal state.
      
          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <!--
              Modal panel, show/hide based on modal state.
      
              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
                <div
                    class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <Icon icon="mdi:success-circle-outline" class="text-blue-600" height="44"></Icon>
                            </div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title"> {{ title }}
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">{{ content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button"
                            class="inline-flex w-full justify-center rounded-md bg-[#5046e5] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4706e5] sm:ml-3 sm:w-auto">{{
                                confirmButtonTitle }}</button>
                        <button type="button"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">{{
                                cancelButtonTitle }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const emits = defineEmits(['onCancel', 'onConfirm'])
const props = defineProps({
    content: {
        type: String,
        default: 'Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.'
    },
    title: {
        type: String,
        default: 'Deactivate account'
    },
    cancelButtonTitle: {
        type: String,
        default: 'Cancel'
    },
    confirmButtonTitle: {
        type: String,
        default: 'Confirm'
    }
})


const content = computed(() => props.content)
const title = computed(() => props.title)
const cancelButtonTitle = computed(() => props.cancelButtonTitle)
const confirmButtonTitle = computed(() => props.confirmButtonTitle) 
</script>