<template>
    <div class="page-wrapper m-grid__item m-grid__item--fluid m-wrapper">
        <div class="m-content">
            <Notice :notice="notice"></Notice>
            <ModalDelete
                    class="ModalDelete"
                    @close="hideModalDelete"
                    @delete="removeProject(id)">
                <h5 slot="header">Удаление проекта &laquo;{{ name }}&raquo;</h5>
                <div slot="body">
                    Вы действительно хотите удалить проект &laquo;{{ name }}&raquo;?
                </div>
            </ModalDelete>
            <div v-for="project in projects"
                 class="project-block alert m-alert--air m--margin-bottom-30">
                <div class="project-block__info">
                    <router-link
                            event="click"
                            :to="{name: 'EditProjectForm', params: {id: project.id}}"
                            class="project-block__name custom-link--inline custom-link--inline-table-edit">
                                <span class="tooltip-wrap">{{ project.name }}
                                    <Tooltip></Tooltip>
                                </span>
                    </router-link> <br/>
                </div>
                <div class="project-block__collection">
                    <router-link :to="{name: 'CollectionsList', params: {id: project.id}}"
                                 class="custom-link--inline">
                        Коллекций: {{ project.collection_count }}
                    </router-link>
                </div>
                <div class="delete-icon"
                     @click="showModalDelete(project)">
                    <i class="la la-trash"></i>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12 col-md-7 offset-md-5">
                    <div class="dataTables_paginate paging_simple_numbers" id="m_table_1_paginate">
                        <ul class="pagination">
                            <li class="paginate_button page-item previous" id="m_table_1_previous">
                                <a @click.prevent="loadPage(current_page - 1)" href="#" aria-controls="m_table_1" data-dt-idx="0" tabindex="0" class="page-link">
                                    <i class="la la-angle-left"></i>
                                </a>
                            </li>
                            <li v-for="item in total_projects" class="paginate_button page-item"
                                :class="['paginate_button page-item', { 'active' : current_page == item }]">
                                <a @click.prevent="loadPage(item)" href="#" aria-controls="m_table_1" data-dt-idx="1" tabindex="0" class="page-link">{{item}}</a>
                            </li>
                            <li class="paginate_button page-item next" id="m_table_1_next">
                                <a @click.prevent="loadPage(current_page + 1)" href="#" aria-controls="m_table_1" data-dt-idx="8" tabindex="0" class="page-link">
                                    <i class="la la-angle-right"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import Notice from "../components/notice/Notice";
    import ModalDelete from '../components/modal/ModalDelete'
    import Tooltip from '../components/Tooltip'

    export default {
        name: 'ProjectsLists',
        data: function () {
            return {
                notice: 'Заметка для списка проектов',
                id: null,
                name: '',
                url: '',
                collection_count: null,
                loading: false,
                current_page: 1
            }
        },
        methods: {
            showModalDelete: function (project) {
                this.id = project.id;
                this.name = project.name;
                this.url = project.url;
                this.collection_count = project.collection_count;
                this.$modal.show('ModalDelete');
            },
            hideModalDelete: function () {
                this.$modal.hide('ModalDelete');
            },
            removeProject(id) {
                this.$store.dispatch('deleteProject', id);
                this.$modal.hide('ModalDelete');
            },
            loadPage(pageNumber) {
                if (pageNumber > 0 && pageNumber <= this.total_projects) {
                    this.$store.dispatch('getProjects', pageNumber)
                        .then(response => {
                            this.loading = false
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    this.current_page = pageNumber
                }

            }
        },
        created() {
            this.$store.dispatch('getProjects', 1)
        },
        computed: {
            projects() {
                return this.$store.getters.allProjects;
            },
            total_projects() {
                return this.$store.getters.getTotalProjects;
            }
        },
        components: {
            Notice,
            ModalDelete,
            Tooltip
        },
        props: {}

    }

</script>

<style>
    .test-name {
        display: flex;
        flex-wrap: wrap;
        flex-basis: 200px;
        max-width: 326px;
        flex-direction: column;
    }
    .project-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        color: black;
    }

    .project-block:hover {
        text-decoration: none;
    }

    .project-block__info {
        position: relative;
        flex-basis: 250px;
        max-width: 250px;
        padding: 0 15px 0 0;
    }

    .project-block__info:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: #80808029;
    }

    .project-block__name {
        font-size: 16px;
        font-weight: 400;
        color: black;
    }

    .project-block__name:hover {
        color: #2739c1;
    }

    .project-block__collection {
        padding: 0 0 0 15px;
        flex-basis: 130px;
        flex-grow: 1;
    }

    .project-block__edit {
        flex-basis: 30px;
    }

    .project-block__edit i {
        color: #212529;
    }

    .project-block__edit a:hover {
        text-decoration: none;
    }

    .project-block i {
        font-size: 1.1rem;
    }

</style>

