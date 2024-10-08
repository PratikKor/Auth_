import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
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
