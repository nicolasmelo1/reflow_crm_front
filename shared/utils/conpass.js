const initializeConpass = (user_full_name, user_email, custom_data) => {
    if (window.Conpass) {
        window.Conpass.init({   
            name: user_full_name,   
            email: user_email,      
            custom_fields: custom_data 
        });
    }
}

export default initializeConpass