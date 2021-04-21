listar();

function listar() {

    $.get("Seccion/listarSeccion", function (data) {

        crearListado(["Id Seccion", "Nombre"], data);
    });
}

var nombreSeccion = document.getElementById("txtnombre");

nombreSeccion.onkeyup = function () {
    var nombre = document.getElementById("txtnombre").value;
    $.get("Seccion/buscarSeccionPorNombre/?nombreSeccion=" + nombre, function (data) {
        crearListado(["Id Seccion", "Nombre"], data);
    });
}


function crearListado(arrayColumnas, data) {
    var contenido = "";
    contenido += "<table id='tabla-alumno' class='table'>";
    contenido += "<thead>";
    contenido += "<tr>";
    for (var i = 0; i < arrayColumnas.length; i++) {
        contenido += "<td>" + arrayColumnas[i] + "</td>";
    }
    contenido += "<td>Operaciones</td>";
    contenido += "</tr>";
    var llaves = Object.keys(data[0]);
    contenido += "<tbody>";
    for (var i = 0; i < data.length; i++) {

        contenido += "<tr>";
        for (var j = 0; j < llaves.length; j++) {
            var valorLLaves = llaves[j];
            contenido += "<td>" + data[i][valorLLaves] + "</td>";
        }
        contenido += "<td>";
        contenido += "<button class='btn-primary' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn-danger'><i class='glyphicon glyphicon-trash'></i></button>"
        contenido += "</td>";
        contenido += "</tr>";
    }

    contenido += "</tbody>";
    contenido += "</thead>";
    contenido += "</table>";

    document.getElementById("tabla").innerHTML = contenido;
    $("#tabla-alumno").dataTable(
        {
            searching: false
        }
    );
}


