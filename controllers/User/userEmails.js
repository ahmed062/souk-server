import sgMail from '@sendgrid/mail';

sgMail.setApiKey(
    `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`
);

const sendEmail = (email, name, verificationCode) => {
    sgMail
        .send({
            to: email,
            from: 'ashaban7642@gmail.com',
            subject: 'thanks for joining in! ',
            text: `welcome to the app, ${name}. This is your verivication code ${verificationCode}`,
            html: `<h3>welcome to the app, ${name}. This is your verivication code <h2> ${verificationCode} </h2> </h3>`,
        })
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

export default sendEmail;
