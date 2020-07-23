const paths = {
    empty() {
        return '/'
    },
    login() {
        return '/login'
    },
    onboarding() {
        return '/onboarding'
    },
    changepassword() {
        return '/changepassword'
    },
    home(form) {
        return form ? `/home/${form}` : `/home/[form]`
    },
    notifications() {
        return '/notifications'
    },
    billing() {
        return '/settings/billing'
    }
}

export default paths