import AuthPage from './AuthPage'
import Layout from './Layout'
import ProjectsLists from './pages/ProjectsLists'
import CollectionsList from './pages/CollectionsList'
import DocumentsList from './pages/DocumentsList'

import AddProjectForm from './pages/forms/AddProjectForm'
import EditProjectForm from './pages/forms/EditProjectForm'

import AddCollectionForm from './pages/forms/AddCollectionForm'
import EditCollectionForm from './pages/forms/EditCollectionForm'

import AddDocumentForm from './pages/forms/AddDocumentForm'
import EditDocumentForm from './pages/forms/EditDocumentForm'

import Logout from './components/auth/Logout'
import Parent from "./pages/Parent";
import DocumentPage from "./pages/DocumentPage";

const routes = [
    {
        path: '/login',
        component: AuthPage,
        name: 'login',
        meta: {
            requiresVisitor: true,
        }
    },
    {
        path: '/dashboard',
        component: Layout,
        name: 'dashboard',
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: 'project',
                name: 'Parent',
                component: Parent,
                children: [
                    {
                        path: '',
                        name: 'Projects',
                        component: ProjectsLists,
                    },
                    {
                        path: ':id',
                        name: 'Parent',
                        component: Parent,
                        children: [
                            {
                                path: '',
                                name: 'CollectionsList',
                                component: CollectionsList,
                                props: ':id'
                            },
                            {
                                path: 'collection/:collection_id',
                                name: 'DocumentsList',
                                component: DocumentsList,
                                children: [
                                    {
                                        path: '',
                                        name: 'DocumentsList',
                                        component: DocumentsList,
                                    },
                                ]
                            },
                            {
                                path: 'collection/:collection_id/add-document-to-analysis',
                                name: 'AddDocumentForm',
                                component: AddDocumentForm,
                                props: {isDocumentAnalysed: true}
                            },
                            {
                                path: 'collection/:collection_id/add-document-to-collection',
                                name: 'AddDocumentFormToCollection',
                                component: AddDocumentForm,
                                props: {isDocumentAnalysed: false}
                            },
                            {
                                path: 'collection/:collection_id/document/:document_id',
                                name: 'DocumentPage',
                                component: DocumentPage,
                            },
                            {
                                path: 'collection/:collection_id/document/:document_id/edit',
                                name: 'EditDocumentForm',
                                component: EditDocumentForm,
                            },
                            {
                                path: 'edits',
                                name: 'EditProjectForm',
                                component: EditProjectForm,
                            },
                            {
                                path: 'collection-add',
                                name: 'AddCollection',
                                component: AddCollectionForm,
                            },
                            {
                                path: 'collection/:collection_id/edit',
                                name: 'EditCollection',
                                component: EditCollectionForm,
                            },
                        ],
                    },
                    {
                        path: 'add',
                        name: 'AddProjectForm',
                        component: AddProjectForm,
                    },
                ],
            },

        ]
    },
    {
        path: '/logout',
        name: 'logout',
        component: Logout
    }

];

export default routes;
