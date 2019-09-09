<template>
    <div class="page-wrapper m-grid__item m-grid__item--fluid m-wrapper">
        <div class="m-content">
            <Notice :notice="notice"></Notice>
            <div class="table-wrap">
                <ModalDelete
                        class="ModalDelete"
                        @close="hideModalDelete"
                        @delete="collectionsToDelete.length > 1 ? deleteCollections(collectionsToDelete) : deleteCollection(id)">
                    <template v-if="collectionsToDelete.length > 1">
                        <h5 slot="header">Удаление коллекций</h5>
                        <div slot="body">
                            <p>Подтвердите удаление следующих коллекций:</p>
                            <p v-for="collection in collectionsToDelete"> &laquo;{{collection.name}}&raquo;</p><br/>
                        </div>
                    </template>
                    <template v-if="!collectionsToDelete.length || this.collectionsToDelete.length == 1">
                        <h5 slot="header">Удаление коллекции</h5>
                        <div slot="body">
                            Подтвердите удаление коллекции &laquo;{{ name }}&raquo;
                        </div>
                    </template>
                </ModalDelete>
                <table class="custom-table table m-table">
                    <thead>
                    <tr>
                        <th class="table-col--5">
                            <label class="custom-checkbox m-checkbox m-checkbox--air">
                                <input type="checkbox">
                                <span></span>
                            </label>
                        </th>
                        <th class="table-col--5">#</th>
                        <th class="table-col--30">Наименование коллекции</th>
                        <th class="table-col--30">Дата создания</th>
                        <th class="table-col--30">Редактирования</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <template  v-for="(category) in categories">

                        <tr v-if="category.collection_count > 0" class="table-row--category js-row-category">
                            <td class="table-col--5">
                                <label class="custom-checkbox m-checkbox m-checkbox--solid m-checkbox--state-success">
                                    <input  v-model="checkedCategories"
                                            :value="category.id"
                                            class="custom-checkbox__input"
                                            type="checkbox"
                                            @click="openCollections(category, $event)">
                                    <span></span>
                                </label>
                            </td>
                            <td colspan="7">{{ category.name }}</td>
                        </tr>
                        <tr class="m-datatable__row-subtable" v-if="collections[category.id]">
                            <td colspan="8"
                                class="m-datatable__col-subtable">
                                <div>
                                    <table class="nested-table custom-table table table-striped m-table">
                                        <tbody>
                                        <tr class="datatable__row-subtable--custom" v-for="(collection, index) in collections[category.id]"
                                            :key="index">
                                            <td class="table-col--5">
                                                <label class="custom-checkbox m-checkbox m-checkbox--air">
                                                    <input
                                                            v-model="collectionsToDelete"
                                                            :value="collection"
                                                            type="checkbox">
                                                    <span></span>
                                                </label>
                                            </td>


                                            <td class="table-col--5 padding-0">
                                                <router-link  event="click"
                                                              :to="{name: 'DocumentsList', params: {collection_id: collection.id}}"
                                                              class="custom-link--inline custom-link--inline-table">
                                                    {{ index + 1 }}
                                                </router-link>
                                            </td>
                                            <td class="table-col--30 padding-0">
                                                <router-link
                                                        event="click"
                                                        :to="{name: 'EditCollection', params: {collection_id: collection.id}}"

                                                        class="custom-link--inline custom-link--inline-table custom-link--inline-table-edit">
                                                    <span class="tooltip-wrap">
                                                        {{ collection.name }}
                                                        <Tooltip></Tooltip>
                                                    </span>
                                                </router-link>

                                            </td>


                                            <td class="table-col--30 padding-0">
                                                <router-link  event="click"
                                                              :to="{name: 'DocumentsList', params: {collection_id: collection.id}}"
                                                              class="custom-link--inline custom-link--inline-table">
                                                    {{ collection.created_at }}
                                                </router-link>

                                            </td>


                                            <td class="table-col--30 padding-0">
                                                <router-link  event="click"
                                                              :to="{name: 'DocumentsList', params: {collection_id: collection.id}}"
                                                              class="custom-link--inline custom-link--inline-table">
                                                    {{ collection.updated_at }}
                                                </router-link>
                                            </td>
                                            <td @click="showModalDelete(collection)">
                                                <i class="la la-trash delete-icon"></i>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Notice from "../components/notice/Notice";
    import ModalDelete from '../components/modal/ModalDelete.vue'
    import Tooltip from '../components/Tooltip'

    export default {
        name: "CollectionsList",
        data: function () {
            return {
                notice: 'Заметка для списка коллекций проекта',
                id_project: this.$route.params.id,
                id_category: null,
                id: null,
                name: '',
                collection_count: 0,
                isOpenCollection: false,
                activeCategoriesInitial: [],
                collectionsToDelete: []
            }
        },
        computed: {
            current_project() {
                return this.$store.getters.getProject
            },
            categories() {
                return this.$store.getters.getCategories
            },
            collections() {
                return this.$store.getters.getCollections
            },
            checkedCategories: {
                get() {
                    return this.$store.state.activeCategories
                },
                set (value) {
                    this.$store.commit('updateActiveCategories', value);
                }
            }
        },
        methods: {
            showModalDelete: function (collection) {
                if(!this.collectionsToDelete.length || this.collectionsToDelete.length == 1) {
                    this.id = collection.id;
                    this.name = collection.name;
                    this.id_category = collection.category_id;
                }
                this.$modal.show('ModalDelete');
                $('body').addClass('modal-open', 'overflow-hidden');
            },
            hideModalDelete: function() {
                this.$modal.hide('ModalDelete');
                $('body').removeClass('modal-open', 'overflow-hidden');
            },
            deleteCollection(id) {
                this.$store.dispatch('deleteCollection',
                    {
                        id_category: this.id_category,
                        id_collection: id,
                        id_project: this.id_project
                    });
                this.collectionsToDelete = [];
                this.$modal.hide('ModalDelete');
            },
            deleteCollections(collectionsToDelete) {

                for(let i = 0; i < collectionsToDelete.length; ++ i) {

                    this.$store.dispatch('deleteCollection',
                        {
                            id_project: this.id_project,
                            id_collection: collectionsToDelete[i].id
                        });
                }

                this.collectionsToDelete = [];
                this.$modal.hide('ModalDelete');
            },
            openCollections: function(category, event) {
                if (event.target.checked) {
                    this.$store.dispatch("getCollections", {
                        id_category: event.target.value,
                        id_project: this.id_project
                    });
                } else {
                    this.$store.commit('getCollections', {"categoryID": event.target.value, "collections": null});
                }
            },
            getCoockie() {
                this.activeCategoriesInitial = this.$cookies.get('active_categories');
            }
        },
        components: {
            Notice,
            ModalDelete,
            Tooltip
        },
        created() {
            this.$store.dispatch('getProject', this.id_project);
            this.$store.dispatch('getCategories', this.id_project);
        }
    }
</script>
