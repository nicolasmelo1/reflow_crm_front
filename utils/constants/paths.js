const paths = {
    empty() {
        return '/'
    },
    login() {
        return '/login'
    },
    home(form, slugged=false) {
        return slugged ? `/home/[form]` : `/home/${form}`
    }
}

export default paths