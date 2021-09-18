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
            console.error(error.response.body);
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
            return error;
        });
};

const sendAdEmail = (email, name, req, slug) => {
    sgMail
        .send({
            to: email,
            from: 'ashaban7642@gmail.com',
            subject: `Hello ${name} check new updates in our store`,
            text: `Hello, ${name}. there is a new product was added to store, check it from  <a href="${
                req.protocol
            }://${req.get('host')}/api/product/${slug}" >Here</a>`,
            html: `<h3>Hello, ${name}. Check new products from <a href="${
                req.protocol
            }://${req.get('host')}/api/product/${slug}" >Here</a> </h3>`,
        })
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

const sendSpecialEmail = (email, message) => {
    sgMail
        .send({
            to: email,
            from: 'ashaban7642@gmail.com',
            subject: `Hello from souk`,
            text: `Hello, from souk`,
            html: `<h3>Hello, from souk.</h3> <br/> <p>${message}</p>`,
        })
        .then(() => {
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
};

export {
    sendVerifyEmail,
    sendResetPasswordEmail,
    sendAdEmail,
    sendSpecialEmail,
};
