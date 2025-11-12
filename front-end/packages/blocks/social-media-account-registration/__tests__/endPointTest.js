const { exec } = require("child_process");

var config = require('../../social-media-account/src/config')
var host = require('../../../framework/src/config').baseURL.replace("http://", '').replace("https://", '');        

var data = JSON.stringify({
    data: {
        type: "social_account",
        attributes: {
            email: `${Math.random().toString(36).slice(2)}@email.com`,
            password: 'password',
            unique_auth_id: 'unique_auth_id'
        }
    }
})

exec(`cd ../../../.. && node endPointTest.js --host ${host} --path ${config.createAccountURL} --body '${data}'`, (error, stdout, stderr) => {
    if (error) {
        console.log(`EndPoint Returned Error: ${error}`);
    }
    
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});