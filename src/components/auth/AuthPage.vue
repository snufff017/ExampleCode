<template>
    <div class="m-grid m-grid--hor m-grid--root m-page">
        <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--signin"
             id="m_login">
            <div class="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside">
                <div class="m-stack m-stack--hor m-stack--desktop">
                    <div class="m-stack__item m-stack__item--fluid">
                        <div class="m-login__wrapper">
                            <div class="m-login__signin">
                                <div class="m-login__head">
                                    <h3 class="m-login__title">Sign In To Admin</h3>
                                </div>

                                <form @submit.prevent="validateBeforeSubmit"
                                      class="m-login__form m-form">
                                    <div v-if="serverError && !successAuth"
                                         class="alert alert-danger alert-dismissible m-alert m-alert--air"
                                         role="alert">
                                        <div class="m-alert__icon">
                                        </div>
                                        <div class="m-alert__text">{{ serverError }}</div>
                                    </div>
                                    <div class="form-group m-form__group"
                                         :class="{'has-danger': errors.has('email') }">
                                        <input class="form-control m-input"
                                               v-validate="'required|email'"
                                               v-model="username" type="email"
                                               placeholder="Email" name="email">
                                        <span class="form-control-feedback">{{ errors.first('email') }}</span>
                                    </div>
                                    <div class="form-group m-form__group" :class="{'has-danger': errors.has('password') }">
                                        <input class="form-control m-input m-login__form-input--last"
                                               v-validate="'required|min:5'"
                                               v-model="password"
                                               type="password"
                                               placeholder="Password"
                                               name="password">
                                        <span class="form-control-feedback">{{ errors.first('password') }}</span>
                                    </div>
                                    <div class="m-login__form-action">
                                        <button type="submit" id="m_login_signin_submit"
                                                class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
                                            Sign In
                                            <div class="lds-ring-container"
                                                 v-if="loading">
                                                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                                            </div>
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    export default {
        name: 'AuthPage',
        data() {
            return {
                username: '',
                password: '',
                serverError: '',
                successAuth: false,
                loading: false
            }
        },
        computed: {
        },
        methods: {
            login() {
                this.loading = true
                this.$store.dispatch('retrieveToken', {
                    username: this.username,
                    password: this.password
                })
                    .then(response => {
                        this.$router.push({ name: 'dashboard' })
                        this.loading = false
                        this.successAuth = true

                    })
                    .catch(error => {
                        this.loading = false,
                            this.serverError = error.response.statusText
                        if (this.serverError === 'Unauthorized') {
                            this.serverError = 'This user unauthorized'
                        }
                    })

            },
            validateBeforeSubmit() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.login();
                    }

                });
            }

        }
    }

</script>

<style>
</style>
