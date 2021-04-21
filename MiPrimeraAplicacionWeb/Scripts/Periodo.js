$("#datepickerInicio").datepicker(
    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
    }
);
$("#datepickerFin").datepicker(
    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
    }
);

listar();
function listar() {
    $.get("Periodo/listarPeriodo", function (data) {
        crearListado(["Id Periodo", "Nombre", "Fecha Inicio", "Fecha Fin"], data);
    }
    );
}

var nombrePeriodo = document.getElementById("txtnombre");

nombrePeriodo.onkeyup = function () {
    var nombre = document.getElementById("txtnombre").value;
    $.get("Periodo/buscarPeriodoPorNombre/?nombrePeriodo=" + nombre, function (data) {
        crearListado(["Id Periodo", "Nombre", "Fecha Inicio", "Fecha Fin"], data);
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
        var llaveId = llaves[0];
        contenido += "<td>";
        contenido += "<button class='btn-primary' onclick='abrirModal(" + data[i][llaveId] + ")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn-danger'onclick='eliminar(" + data[i][llaveId] + ")'><i class='glyphicon glyphicon-trash'></i></button>"
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

function abrirModal(id) {
    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
    } else {
        $.get("Periodo/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdPeriodo").value = data[0].IIDPERIODO;
            document.getElementById("txtnombreCurso").value = data[0].NOMBRE;
            document.getElementById("datepickerInicio").value = data[0].FECHAINICIO;
            document.getElementById("datepickerFin").value = data[0].FECHAFIN;
        })
    }
}

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
}

function eliminar(id) {
    var frm = new FormData();
    frm.append("IIDPERIODO", id);
    if (confirm("Desea Eliminar los Datos?") == 1) {
        $.ajax(
            {
                type: "POST",
                url: "Periodo/eliminar",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data != 0) {
                        listar();
                        alert("Se ejecuto Correctamente");
                        document.getElementById("btnCancelar").click();
                    } else {
                        alert("Ocurrio un Error");
                    }
                }
            }
        );
    }
}
function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIdPeriodo").value;
        var nombre = document.getElementById("txtnombreCurso").value;
        var fechaInicio = document.getElementById("datepickerInicio").value;
        var fechaFin = document.getElementById("datepickerFin").value;

        frm.append("IIDPERIODO", id);
        frm.append("NOMBRE", nombre);
        frm.append("FECHAINICIO", fechaInicio);
        frm.append("FECHAFIN", fechaFin);
        frm.append("BHABILITADO", 1);
        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "Periodo/guardar",
                    data: frm,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data != 0) {
                            listar();
                            alert("Se ejecuto Correctamente");
                            document.getElementById("btnCancelar").click();
                        } else {
                            alert("Ocurrio un Error");
                        }
                    }
                }
            );
        }
    }
    else {

    }
}

function datosObligatorios() {
    var exito = true;
    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        if (controlesObligatorio[i].value == "") {
            exito = false;
            controlesObligatorio[i].parentNode.classList.add("error");
        } else {
            controlesObligatorio[i].parentNode.classList.remove("error");

        }
        //controles[i].value = "";
    }
    return exito;
}