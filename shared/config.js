module.exports = {
    API: process.env.API_HOST ? process.env.API_HOST : 'http://192.168.1.100:8000/', //'http://192.168.1.101:8000/', //'http://localhost:8000/',//'https://api-gateway.staging.reflow.com.br/',
    BEARER: "Client",
    VINDI_PUBLIC_API: process.env.VINDI_PUBLIC_API ? process.env.VINDI_PUBLIC_API : 'https://sandbox-app.vindi.com.br/api/v1/public/payment_profiles',
    VINDI_PUBLIC_API_KEY: process.env.VINDI_PUBLIC_API_KEY ? process.env.VINDI_PUBLIC_API_KEY :  'uNZqO8kJbVRIRSiBEsbyWRGtpTGLd432AxXHYltw_Ow',
    FRONT_END_HOST: process.env.FRONT_END_HOST ? process.env.FRONT_END_HOST : 'http://localhost:3000/'
};