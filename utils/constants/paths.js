const paths = {
    empty() {
        return '/'
    },
    login() {
        return '/login'
    },
    home(companyId, visualizationType, form) {
        return `/${companyId}/home/${visualizationType}/${form}`
    }
}

export default paths