class Socio {
    constructor(nombre, apellido, edad, numeroSocio, disciplina, genero) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.numeroSocio = numeroSocio;
        this.disciplina = disciplina;
        this.genero = genero;
    }
}

const listadoSocios = JSON.parse(localStorage.getItem("socios")) || [];

function guardarSociosEnLocalStorage() {
    localStorage.setItem("socios", JSON.stringify(listadoSocios));
}

function renderizarSocios() {
    const listaSocios = document.getElementById("listaSocios");
    listaSocios.innerHTML = "";

    listadoSocios.forEach((socio, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${socio.nombre}</td>
            <td>${socio.apellido}</td>
            <td>${socio.edad}</td>
            <td>${socio.numeroSocio}</td>
            <td>${socio.disciplina}</td>
            <td>${socio.genero}</td>
            <td>
                <button class="editar" onclick="editarSocio(${index})">Editar</button>
                <button class="eliminar" onclick="eliminarSocio(${index})">Eliminar</button>
            </td>
        `;

        listaSocios.appendChild(fila);
    });
}

function actualizarEstadisticas() {
    const totalSocios = listadoSocios.length;
    document.getElementById("totalSocios").textContent = totalSocios;

    // Cantidad por género
    const generos = listadoSocios.reduce((acc, socio) => {
        acc[socio.genero] = (acc[socio.genero] || 0) + 1;
        return acc;
    }, {});

    // Mostrar cantidad por género
    const sociosPorGenero = document.getElementById("sociosPorGenero");
    sociosPorGenero.innerHTML = "";
    for (const [genero, cantidad] of Object.entries(generos)) {
        const li = document.createElement("li");
        li.textContent = `${genero}: ${cantidad}`;
        sociosPorGenero.appendChild(li);
    }

    // Cantidad por disciplina, desglosada por género
    const disciplinasPorGenero = listadoSocios.reduce((acc, socio) => {
        if (!acc[socio.disciplina]) {
            acc[socio.disciplina] = { Masculino: 0, Femenino: 0, Otro: 0 };
        }
        acc[socio.disciplina][socio.genero]++;
        return acc;
    }, {});

    // Mostrar cantidad por disciplina y género
    const sociosPorDisciplina = document.getElementById("sociosPorDisciplina");
    sociosPorDisciplina.innerHTML = "";
    for (const [disciplina, generoData] of Object.entries(disciplinasPorGenero)) {
        const li = document.createElement("li");
        li.textContent = `${disciplina}: Masculino: ${generoData.Masculino}, Femenino: ${generoData.Femenino}, Otro: ${generoData.Otro}`;
        sociosPorDisciplina.appendChild(li);
    }

    // Porcentaje por género
    const porcentajeGeneros = {
        Masculino: ((generos.Masculino || 0) / totalSocios * 100).toFixed(2),
        Femenino: ((generos.Femenino || 0) / totalSocios * 100).toFixed(2),
        Otro: ((generos.Otro || 0) / totalSocios * 100).toFixed(2),
    };

    // Mostrar porcentaje por género
    const porcentajeGeneroElement = document.getElementById("porcentajeGenero");
    porcentajeGeneroElement.innerHTML = "";
    for (const [genero, porcentaje] of Object.entries(porcentajeGeneros)) {
        const li = document.createElement("li");
        li.textContent = `${genero}: ${porcentaje}%`;
        porcentajeGeneroElement.appendChild(li);
    }

    // Porcentaje por disciplina
    const disciplinas = listadoSocios.reduce((acc, socio) => {
        acc[socio.disciplina] = (acc[socio.disciplina] || 0) + 1;
        return acc;
    }, {});

    const porcentajeDisciplina = {};
    for (const [disciplina, cantidad] of Object.entries(disciplinas)) {
        porcentajeDisciplina[disciplina] = ((cantidad / totalSocios) * 100).toFixed(2);
    }

    // Mostrar porcentaje por disciplina
    const porcentajeDisciplinaElement = document.getElementById("porcentajeDisciplina");
    porcentajeDisciplinaElement.innerHTML = "";
    for (const [disciplina, porcentaje] of Object.entries(porcentajeDisciplina)) {
        const li = document.createElement("li");
        li.textContent = `${disciplina}: ${porcentaje}%`;
        porcentajeDisciplinaElement.appendChild(li);
    }
}



function eliminarSocio(index) {
    listadoSocios.splice(index, 1);
    guardarSociosEnLocalStorage();
    renderizarSocios();
    actualizarEstadisticas();
}

function editarSocio(index) {
    const socio = listadoSocios[index];
    document.getElementById("nombre").value = socio.nombre;
    document.getElementById("apellido").value = socio.apellido;
    document.getElementById("edad").value = socio.edad;
    document.getElementById("numeroSocio").value = socio.numeroSocio;
    document.getElementById("disciplina").value = socio.disciplina;
    document.getElementById("genero").value = socio.genero;

    eliminarSocio(index);
}

document.getElementById("formAgregarSocio").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const edad = parseInt(document.getElementById("edad").value, 10);  
    const numeroSocio = document.getElementById("numeroSocio").value;
    const disciplina = document.getElementById("disciplina").value;
    const genero = document.getElementById("genero").value;

  
    if (edad < 4 || edad > 18) {
        alert("La edad debe estar entre 4 y 18 años.");
        return;
    }

    const nuevoSocio = new Socio(nombre, apellido, edad, numeroSocio, disciplina, genero);
    listadoSocios.push(nuevoSocio);
    guardarSociosEnLocalStorage();
    renderizarSocios();
    actualizarEstadisticas();

    document.getElementById("formAgregarSocio").reset();
});



// 

// Cambiar lentamente el color del fondo al mover el mouse
document.body.addEventListener('mousemove', (event) => {
    const red = Math.floor((event.clientX / window.innerWidth) * 255);
    const green = Math.floor((event.clientY / window.innerHeight) * 255);
    const blue = Math.floor(((event.clientX + event.clientY) / (window.innerWidth + window.innerHeight)) * 255);

    // Aplicar el color como fondo del body para simular la transición de colores
    document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
});




renderizarSocios();
actualizarEstadisticas();
