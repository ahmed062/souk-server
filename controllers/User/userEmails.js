import sgMail from '@sendgrid/mail';

sgMail.setApiKey(
    `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`
);

const sendVerifyEmail = (email, name, verificationCode) => {
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

const sendResetPasswordEmail = (email, req, resetToken) => {
    sgMail
        .send({
            to: email,
            from: 'ashaban7642@gmail.com',
            subject: 'Reset your password',
            text: `Hello, You are receving this email because you (or someone else) has requested the reset of a password.
            Please copy and paste the address below to Reset your password.
            ${req.protocol}://${req.get(
                'host'
            )}/api/users/forgotpassword/${resetToken}`,
            html: `<h1>Hello</h1>
            <p>You are receving this email because you (or someone else) has requested the reset of a password.</p>
            <p>Please click the link below to reset your password.</p>
            <a href="${req.protocol}://${req.get(
                'host'
            )}/api/users/forgotpassword/${resetToken}" >Reset your password</a>`,
        })
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

export { sendVerifyEmail, sendResetPasswordEmail };
