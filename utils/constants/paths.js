const paths = {
    empty() {
        return '/'
    },
    login() {
        return '/login'
    },
    home(companyId, form, slugged=false) {
        return slugged ? `/[company]/home/[form]` : `/${companyId}/home/${form}`
    }
}

export default paths