import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

axios.defaults.baseURL = '/api/v1';


export const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || null,
        projects: {},
        total_projects: '',
        current_project: {},
        current_collection: {},
        current_document: {},
        categories: {},
        collections: {},
        activeCategories: [],
        documents: {},
        activeCategoriesDocuments: []
    },
    mutations: {
        retrieveToken(state, token) {
            state.token = token;
        },
        destroyToken(state) {
            state.token = null;
        },
        getProjects(state, data) {
            state.projects = data.list;
            state.total_projects = data.total;
        },
        getProject(state, project) {
            state.current_project = project;
        },
        deleteProject(state, id) {
            const index_project = state.projects.findIndex(project => project.id == id);
            state.projects.splice(index_project, 1)
        },
        getCategories(state, categories) {
            state.categories = categories;
        },
        getCollections(state, data) {
            state.collections[data["categoryID"]] = data["collections"];
        },
        getCollection(state, collection) {
            state.current_collection = collection;
        },
        updateActiveCategories(state, activeCategories) {
            state.activeCategories = activeCategories;
            window.$cookies.set('active_categories', state.activeCategories);
        },
        updateActiveCategoriesDocuments(state, activeCategoriesDocuments) {
            state.activeCategoriesDocuments = activeCategoriesDocuments;
            window.$cookies.set('active_categories_documents', state.activeCategoriesDocuments);
        },
        installInitialCookie(state) {
            if (window.$cookies.get('active_categories') != null) {
                state.activeCategories = window.$cookies.get('active_categories').split(",");
                state.activeCategories = state.activeCategories.map(function(item) { return parseInt(item); });
            }
        },
        getDocuments(state, documents) {
            state.documents = documents;
        },
        getDocument(state, document) {
            state.current_document = document;
        },

    },
    actions: {
        destroyToken(context) {
            if (context.getters.loggedIn) {
                context.commit('destroyToken')
                localStorage.removeItem('token')
            }
        },
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/signin', {
                    username: credentials.username,
                    password: credentials.password,

                })
                    .then(response => {
                        const token = response.data.result.token;
                        localStorage.setItem('token', token);
                        context.commit('retrieveToken', token);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });

        },
        addProject(context, project) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                axios.post('/project', {
                    name: project.name,
                    url: project.url,

                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });

        },
        updateProject(context, project) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                axios.post('/project', {
                    name: project.name,
                    url: project.url,

                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });

        },
        deleteProject(context, id) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token
            axios.delete('/project/' + id)
                .then(response => {
                    context.commit('deleteProject', id)
                })
        },
        getProjects(context, pageNumber) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                axios.get('/project?offset=' + (pageNumber -1)*25  + '&limit=25')
                    .then(response => {
                        context.commit('getProjects', response.data.result)
                        resolve(response)

                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        getProject(context, id) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                axios.get('/project/' + id)
                    .then(response => {
                        context.commit('getProject', response.data.result)
                        resolve(response)

                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        getCategories(context, id_project) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            axios.get('/project/' + id_project + '/categories'+ '?offset=0&limit=10')
                .then(response => {
                    let data = response.data.result.list;

                    data.forEach(function (category) {
                        if (store.state.activeCategories.indexOf(category.id) != -1) {
                            store.dispatch("getCollections", {id_category: category.id, id_project: id_project});
                        }
                    });
                    context.commit('getCategories', data);
                })
        },
        getCollections(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_project = payload.id_project;
            let id_category = payload.id_category;

            axios.get('/project/' + id_project + '/category/' + id_category + '/collections' + '?offset=0&limit=25')
                .then(response => {
                    context.commit('getCollections', {"categoryID": id_category, "collections": response.data.result.list});
                    this.getters.getCategories.push();
                })
        },
        getCollection(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_project = payload.id_project;
            let id_collection = payload.id_collection;

            return new Promise((resolve, reject) => {
                axios.get('/project/' + id_project + '/collection/' + id_collection)
                    .then(response => {
                        context.commit('getCollection', response.data.result);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });
        },
        addDocument(context, document) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                axios.post(
                    '/project/' + context.state.current_project.id + '/collection/' + context.state.current_collection.id + '/document',
                    {
                        category: document.category,
                        collection_id: document.id_collection,
                        name: document.name,
                        text: document.text,
                        url: document.url_document
                    })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });

        },
        getDocuments(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_project = payload.id_project;
            let id_collection = payload.id_collection;

            return new Promise((resolve, reject) => {
                axios.get('/project/' + id_project + '/collection/' + id_collection  + '/documents' + '?offset=0&limit=25')
                    .then(response => {

                        let data = response.data.result.list;
                        let documentByCategory = {};
                        for (let i = 0; i < data.length; i ++) {
                            let document = data[i];
                            if (documentByCategory[document.category] == null) {
                                documentByCategory[document.category] = [];
                            }

                            documentByCategory[document.category].push(document);
                        }

                        context.commit('getDocuments', documentByCategory);
                        resolve(response)

                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        getDocument(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_project = payload.id_project;
            let id_collection = payload.id_collection;
            let id_document = payload.id_document;

            return new Promise((resolve, reject) => {
                axios.get('/project/' + id_project + '/collection/' + id_collection  + '/document/' + id_document)
                    .then(response => {

                        let data = response.data.result.list;
                        context.commit('getDocument', data);
                        resolve(response)

                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        addCollection(context, collection) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                axios.post('/project/' + collection.id_project + '/collection', {
                    name: collection.name,
                    category_name: collection.category_name,
                    category_id: collection.category_id,

                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });

        },
        deleteCollection(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_collection = payload.id_collection;
            let id_project = payload.id_project;


            axios.delete('/project/' + id_project + '/collection/' + id_collection)
                .then(response => {
                    store.dispatch('getCategories', id_project)
                })
        },
        updateCollection(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_project = payload.id_project;
            let id_collection = payload.id_collection;
            let collection_name = payload.collection_name;
            let category_name = payload.category_name;
            let category_id = payload.category_id.toString();

            return new Promise((resolve, reject) => {
                axios.put('/project/' + id_project + '/collection/' + id_collection,
                    {
                        name: collection_name,
                        category_name: category_name,
                        category_id: category_id,
                    })
                    .then((response) => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    });
            });

        },
        deleteDocument(context, payload) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

            let id_collection = payload.id_collection;
            let id_project = payload.id_project;
            let id_document = payload.id_document;


            axios.delete('/project/' + id_project + '/collection/' + id_collection + '/document/' + id_document)
                .then(response => {
                    store.dispatch('getDocuments', {
                        id_project: id_project,
                        id_collection: id_collection
                    })
                })
        }
    },
    getters: {
        loggedIn(state) {
            return state.token !== null
        },
        allProjects(state) {
            return state.projects
        },
        getTotalProjects(state) {
            return Math.ceil(state.total_projects / 25)
        },
        getProject(state) {
            return state.current_project
        },
        getCategories(state) {
            return state.categories
        },
        getCollections(state) {
            return state.collections
        },
        getCollection(state) {
            return state.current_collection
        },
        getDocuments(state) {
            return state.documents
        },
        getDocument(state) {
            return state.current_document
        },
    }
})
