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
    home(form, slugged=false) {
        return slugged ? `/home/[form]` : `/home/${form}`
    },
    notifications() {
        return '/notifications'
    }
}

export default paths