// @flow

import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

//TODO prepare aws config.js
aws.config.loadFromPath('aws_config.json');

const transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});

export const sendMail = (opts: Object)=> {
    const { from, to, subject, text } = opts;
    transporter.sendMail({
        Source: from,
        to,
        subject,
        text,
        // ses: { // optional extra arguments for SendRawEmail
        //     Tags: [{
        //         Name: 'tag name',
        //         Value: 'tag value'
        //     }]
        // }
    }, (err, info) => {
        if(err) {
           console.log("JMOZGAWA: err", err);
        } else {
            console.log("JMOZGAWA info.envelope", info.envelope);
            console.log("JMOZGAWA info.messageId", info.messageId);
        }
    });
}


