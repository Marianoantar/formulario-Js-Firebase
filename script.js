
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyAZlp7blb-lzhhIjQ5pY6rlGlKDGL7kVL4",
    authDomain: "datos-de-formulario-caa59.firebaseapp.com",
    projectId: "datos-de-formulario-caa59",
    storageBucket: "datos-de-formulario-caa59.appspot.com",
    messagingSenderId: "190705893881",
    appId: "1:190705893881:web:6a669c64c4ab4954bffd28",
    measurementId: "G-MF4K0VEJ7M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Mostrar Registro de Base de Datos
const mostrarRegistro = () => {
    const listaUsuarios = document.getElementById("lista-usuarios"); 
    listaUsuarios.textContent = '';

    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const datosUsuario = doc.data();

            // crea elementos
            // crea li
            const li = document.createElement("li");
            // establecer contenido
            li.textContent = `${datosUsuario.Nombre} => ${datosUsuario.email}`;

            // crea boton para borrar
            const buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'Eliminar'; // Establece el texto del botón
            buttonDelete.addEventListener('click', () =>{
                // ELIMINAR documento
                db.collection("users").doc(doc.id).delete().then(() => {
                    alert("Document successfully deleted!");
                    mostrarRegistro();
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });

            // Agrega boton al <li>  
            li.appendChild(buttonDelete);
           
            // añadir a la lista
            listaUsuarios.appendChild(li);

           
        });
    })
};

mostrarRegistro();


document.getElementById('formulario').addEventListener('submit', (event) => {
    event.preventDefault()

    // validar campo nombre
    let entradaNombre = document.getElementById('name');
    let errorNombre = document.getElementById('nameError');

    if(entradaNombre.value.trim() === '') {
        errorNombre.textContent = "Por favor, introducí tu nombre";
        errorNombre.classList.add(('error-message'))
    }else{
        errorNombre.textContent = '';
        errorNombre.classList.remove(('error-message'))
    }

    // Validar correo electrónico
    let entradaEmail = document.getElementById('email');
    let errorEmail = document.getElementById('emailError');
    let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/ //  patron de validacion basico
    if (!emailPattern.test(entradaEmail.value)) {
        errorEmail.textContent = 'Por favor introducí un mail valido';
        errorEmail.classList.add(('error-message'))
    }else{
        errorEmail.textContent = '';
        errorEmail.classList.remove(('error-message'))
    }


    // Validar la contraseña
    let entradaContrasena = document.getElementById('password');
    let errorContrasena = document.getElementById('passwordError');
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    if (!passwordPattern.test(entradaContrasena.value)){
        errorContrasena.textContent = 'La contraseña debe tener 8 a 15 caracteres, Al menos una mayuscula, una minuscula, un num y un caracter especial';
        errorContrasena.classList.add(('error-message'))
    }else{
        errorContrasena.textContent = '';
        errorContrasena.classList.remove(('error-message'))
    }


    // Si todos los campos son Válidos enviar formulario
    if (!errorNombre.textContent && !errorEmail.textContent && !errorContrasena.textContent) {
        
        // Aqui va BACKEND que reciba la informacion
        // * esto de copia de Firebase
        db.collection("users").add({
            Nombre: entradaNombre.value,
            email: entradaEmail.value,
            password: entradaContrasena.value
        })
        .then((docRef) => {
            alert('El formulario se ha enviado con Exito!!!', docRef.id);
            document.getElementById('formulario').reset();
            mostrarRegistro();
        })
        .catch((error) => {
            alert("Error adding document: ", error);
        });


    }
});
