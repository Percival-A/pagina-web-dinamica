// Funciones básicas

// Esta función guarda el dato proporcionado por el usuario en la base de datos.
function saveData() {
    // Recupera el valor del campo ID del formulario.
    const idValue = inputId.value.trim();
    
    // Recupera el dato que el usuario desea guardar asociado al ID.
    const dataValue = inputData.value.trim();

    // Verifica que ambos campos (ID y dato) no estén vacíos.
    if (idValue && dataValue) {
        
        // Realiza una solicitud al servidor para guardar el dato.
        // La ruta '/save' se definirá en el lado del servidor (en server.js) para manejar esta solicitud.
        fetch('/save', {
            method: 'POST', // Especifica el método HTTP POST para enviar datos.
            headers: {
                'Content-Type': 'application/json', // Define el tipo de contenido como JSON.
            },
            // Convierte el objeto con ID y dato a una cadena JSON para enviarla al servidor.
            body: JSON.stringify({ id: idValue, data: dataValue }),
        })
        .then(response => response.json()) // Convierte la respuesta del servidor a un objeto JavaScript.
        .then(data => {
            // Verifica si el servidor indica que la operación fue exitosa.
            if (data.success) {
                alert('Dato guardado exitosamente!');
            } else {
                alert('Error al guardar el dato.');
            }
        });
    } else {
        alert('Por favor ingresa un ID y un dato.'); // Mensaje de error si los campos están vacíos.
    }
}

// Esta función recupera un dato basado en el ID proporcionado por el usuario.
function fetchData() {
    // Recupera el valor del campo ID del formulario de búsqueda.
    const idValue = searchId.value.trim();

    // Verifica que el campo ID no esté vacío.
    if (idValue) {
        // Realiza una solicitud al servidor para obtener el dato asociado al ID proporcionado.
        // La ruta `/fetch/${idValue}` se definirá en el lado del servidor (en server.js) para manejar esta solicitud.
        fetch(`/fetch/${idValue}`)
        .then(response => response.json()) // Convierte la respuesta del servidor a un objeto JavaScript.
        .then(data => {
            // Verifica si el servidor encontró un dato para el ID proporcionado y si la operación fue exitosa.
            if (data.success && data.data) {
                outputData.textContent = `Resultado: ${data.data}`; // Muestra el dato recuperado en el elemento de salida.
            } else {
                outputData.textContent = 'No se encontró el dato para ese ID.'; // Mensaje de error si no se encuentra el dato.
            }
        });
    } else {
        alert('Por favor ingresa un ID.'); // Mensaje de error si el campo ID está vacío.
    }
}

// Referencias a los elementos del formulario

// Obtiene una referencia al campo de entrada donde el usuario introduce el ID para guardar un dato.
const inputId = document.getElementById('inputId');
// Obtiene una referencia al campo de entrada donde el usuario introduce el dato a guardar.
const inputData = document.getElementById('inputData');
// Obtiene una referencia al botón que el usuario presiona para guardar un dato.
const submitButton = document.getElementById('submitButton');

// Obtiene una referencia al campo de entrada donde el usuario introduce el ID para buscar un dato.
const searchId = document.getElementById('searchId');
// Obtiene una referencia al elemento donde se mostrará el resultado de la búsqueda.
const outputData = document.getElementById('outputData');
// Obtiene una referencia al botón que el usuario presiona para buscar un dato.
const searchButton = document.getElementById('searchButton');

// Eventos para el formulario

// Asigna la función saveData al evento 'click' del botón de guardar.
submitButton.addEventListener('click', saveData);
// Asigna la función fetchData al evento 'click' del botón de búsqueda.
searchButton.addEventListener('click', fetchData);
