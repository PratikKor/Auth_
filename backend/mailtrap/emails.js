import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email,verificationToken) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}",verificationToken),
            category:"Email Verification"
        })
        console.log("Email sent sucessfully")
    }catch(error){
        console.log("Error",error);
        throw new Error(`Error sending Email ,${error}`);
    }
};


export const sendWelcomeEmail = async (email,name) => {
    const recipients = [{email}];
    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "28a80a96-9989-48da-8d1b-9bbd9bf06048",
            template_variables: {
            name: name,
            },
        });
        console.log("welcome email sent sucessfully!")
    }catch(error){
        console.log(`Error sending welcome email`,error);
        throw new Error(`Error sending welcome Email : ${error}`);
    };
};

export const sendPasswordResetEmail = async (email,resetURL)=>{
    const recipient = [{email}];
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset your Password",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Password Reset",
        })
    }catch(error){
        console.log("Error sending reset email",error);
        throw new Error(`Error sending reset Email : ${error}`);
    }
}

export const sendResetSucessEmail = async (email)=>{
    const recipient =[{email}];

    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Sucessful",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password reset",
        })
    }catch(error){
        console.log(`Error sending Password Email,`,error)
        throw new Error(`Error sending password reset sucess email:${error}`);
    }

}