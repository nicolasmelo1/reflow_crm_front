const initializeConpass = (user_full_name, user_email, custom_data) => {
    if (window.Conpass) {
        window.Conpass.init({   
            name: "Ada Lovelace",   
            email: "ada.lovelace@science.com",      
            custom_fields: {   
                lang: "pt_BR",   
                sexo: "Feminino",   
            } 
        });
    }
}

export default initializeConpass