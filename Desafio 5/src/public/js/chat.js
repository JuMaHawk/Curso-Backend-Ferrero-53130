const socket = io();
let user;
const cajaMensajes = document.getElementById("cajaMensajes");

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa un usuario para identificarte",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value;
})

cajaMensajes.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        if (cajaMensajes.value.trim().length > 0) {
            socket.emit("message", { user: user, message: cajaMensajes.value });
            cajaMensajes.value = "";
        }
    }
})


socket.on("mensajesUsuarios", data => {
    const log = document.getElementById("mensajesUsuarios")
    let mensajes = "";

    data.forEach(message => {
        mensajes = mensajes + `${message.user} dice: ${message.message} <br>`
    });
    log.innerHTML = mensajes;
})