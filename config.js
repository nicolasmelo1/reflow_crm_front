module.exports = {
    //API: "https://reflow-server-to-front-staging.xpdufpbcds.us-east-1.elasticbeanstalk.com/",
    API: process.env.API_HOST ? process.env.API_HOST : 'http://localhost:8000/',
    //ICONS_HOST: 'https://s3.us-east-2.amazonaws.com/reflow-crm/staticfiles/icons/',
    BEARER: "Client"
};