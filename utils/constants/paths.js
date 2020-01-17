import { faHome } from "@fortawesome/free-solid-svg-icons"

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