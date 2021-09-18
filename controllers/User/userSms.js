import Vonage from '@vonage/server-sdk';
import asyncHandler from 'express-async-handler';
import { phone } from 'phone';
import dotenv from 'dotenv';
dotenv.config();
// Init Nexmo

const vonage = new Vonage(
    {
        apiKey: process.env.VONAGE_SMS_API_KEY,
        apiSecret: process.env.VONAGE_SMS_SECRET_KEY,
    },
    { debug: true }
);

const sendSms = (from, to, text) =>
    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        } else {
            if (responseData.messages[0]['status'] === '0') {
                console.log('Message sent successfully.');
            } else {
                console.log(
                    `Message failed with error: ${responseData.messages[0]['error-text']}`
                );
                throw new Error(
                    `Message failed with error: ${responseData.messages[0]['error-text']}`
                );
            }
        }
    });

// POST users/verifyPhone
// private
export const verifyPhoneNumber = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;

    const validNumber = phone(phoneNumber);
    console.log(validNumber);
    if (!validNumber.isValid) {
        throw new Error('please enter a valid number');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    try {
        sendSms(
            'Vonage APIs',
            phoneNumber,
            `your verification code is \n ${verificationCode}`
        );
        res.json(verificationCode);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
});
