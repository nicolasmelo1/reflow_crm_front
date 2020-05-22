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
    }
}

export default paths