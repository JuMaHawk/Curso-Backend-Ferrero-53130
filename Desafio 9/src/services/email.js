import nodemailer from "nodemailer";
class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "jmferrero93@gmail.com",
                pass: "brwu lutj sedn jnvx"
            }
        })
    }

    async enviarTicketCompra(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "E-commerce service <jmferrero93@gmail.com>",
                to: email,
                subject: "Ticket de su compra",
                html: `<h1> Detalles de su compra, ${first_name} </h1>
                <p> El numero de tu orden es ${ticket} </p>`
            }
            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.log("Error al enviar el mail")
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            const mailOptions = {
                from: "E-commerce service <jmferrero93@gmail.com>",
                to: email,
                subject: "Restablecimiento de contraseña",
                html: `<h1> Restablecimiento de contraseña de ${first_name} </h1>
                <p> Pediste restablecer la contraseña, Te enviamos el codigo de confirmacion: </p>
                <strong> ${token} </strong>
                <p> Este codigo expira en 1 Hora.</p>
                <a href="http://localhost:8080/password"> Restablecer contraseña </a>
                `
            }
            await this.transporter.sendMail(mailOptions)

        } catch (error) {
            console.log("Error al enviar el mail de restablecimiento.")
        }
    }
}




//NODEMAILER
// app.get("/mail", async (req, res) => {
//     try {
//         await transport.sendMail({
//             from: "Coder Test <jmferrero93@gmail.com>",
//             to: "scelattoflorencia@gmail.com",
//             subject: "Si, lo es... ",
//             html: `< h1 > Te amo mas que en el mail anterior. </>
//             <img src="cid:lavaca">`,
//             //Enviar imagen como asunto
//             attachments: [{
//                 filename: "lavacaenlapileta",
//                 path: "./src/public/img/florenlapileta.jpg",
//                 cid: "lavaca"
//             }]
//         })
//         res.send("Correo enviado correctamente")
//     } catch (error) {
//         res.status(500).send("Error al intentar enviar el email.")
//     }
// })

// app.post("/enviarticket", async (req, res) => {
//     const {email, mensaje} = req.body
//     try {
//         await transport.sendMail({
//             from: "Coder Mail <jmferrero93@gmail.com>",
//             to: email,
//             subject: "TEST",
//             text: mensaje
//         })
//         res.send("Correo enviado exitosamente")
//     } catch (error) {
//         res.status(500).send("No se pude enviar el mensaje")
//     }
// })

// const transport = nodemailer.createTransport({
//     service: "gmail",
//     port: 587,
//     auth: {
//         user: "jmferrero93@gmail.com",
//         pass: "brwu lutj sedn jnvx"
//     }

// })

export default EmailManager