<template>
    <modal name="ModalDelete"
           class="modal"
           :adaptive="true"
           :minHeight="0"
           :maxWidth="500"
           :pivotY="0.1"
           style="height: auto">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header">
                        <h5 class="modal-title"> default header</h5>
                    </slot>

                    <button @click="$emit('close')"
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <slot name="body">
                        default body
                    </slot>
                </div>
                <div class="modal-footer">
                    <button @click="$emit('close')"
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal">
                        Отменить
                    </button>
                    <button
                            @click="$emit('delete')"
                            type="button" class="btn btn-danger">
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    </modal>


</template>

<script>
    export default {
        name: "ModalDelete"
    }
</script>

<style scoped>
    .modal {
        display: block;
        padding-right: 15px;
    }

    .modal-content {
        border: none;
    }
    .modal-dialog {
        margin: 0 auto;
    }
</style>
