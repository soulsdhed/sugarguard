const nodemailer = require("nodemailer");
require("dotenv").config();

// function sendResetEmail(email, link) {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: "sugarguardmaster@gmail.com",
//             pass: "scrp wxhw snma dpep"
//         }
//     });

//     let mailOptions = {
//         from: '"SugarGuard" <sugarguardmaster@gmail.com>',
//         to: email,
//         subject: '비밀번호 변경 요청',
//         html: `
//             <html lang="kr">
//                 <body>
//                     <div style="line-height: 1.6;">
//                         <h2>SugarGuard 비밀번호 변경 요청</h2>
//                         <p>비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 비밀번호를 재설정해주세요.</p>
//                         <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">비밀번호 변경</a>
//                         <p>만약 비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시해주시기 바랍니다.</p>
//                         <p>감사합니다.</p>
//                         <h3>SugarGuard</h3>
//                     </div>
//                 </body>
//             </html>`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Password reset email sent: %s', info.response);
//     });
// }

const sendResetEmail = (email, link) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"SugarGuard" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "비밀번호 변경 요청",
            html: `
            <html lang="kr">
                <body>
                    <div style="line-height: 1.6;">
                        <h2>SugarGuard 비밀번호 변경 요청</h2>
                        <p>비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 비밀번호를 재설정해주세요.</p>
                        <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">비밀번호 변경</a>
                        <p>만약 비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시해주시기 바랍니다.</p>
                        <p>감사합니다.</p>
                        <h3>SugarGuard</h3>
                    </div>
                </body>
            </html>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            console.log("메일 전송: %s", info.response);
            resolve(info.response);
        });
    });
};

module.exports = { sendResetEmail };
