listar();
function listar() {
    $.get("Curso/listarCurso", function (data) {
        crearListado(["ID Curso", "Nombre", "Descripcion"], data);

    }
    );
}
var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.onclick = function ()
{
    var nombre = document.getElementById("txtNombre").value;
    $.get("Curso/buscarCursoPorNombre/?nombre=" + nombre, function (data) {
        crearListado(["ID Curso", "Nombre", "Descripcion"], data);
    });
}

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function ()
{
    $.get("Curso/listarCurso", function (data) {
        crearListado(["ID Curso", "Nombre", "Descripcion"], data);
    }
    );
    document.getElementById("txtNombre").value = "";
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
        contenido += "<button class='btn-primary' onclick='abrirModal(" + data[i][llaveId]+")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn-danger'onclick='eliminar(" + data[i][llaveId] +")'><i class='glyphicon glyphicon-trash'></i></button>"
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
    for (var i = 0; i < ncontroles; i++)
    {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
    } else {
        $.get("Curso/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdCurso").value = data[0].IIDCURSO;
            document.getElementById("txtNombreCurso").value = data[0].NOMBRE;
            document.getElementById("txtDescripcion").value = data[0].DESCRIPCION;
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
    frm.append("IIDCURSO", id);
    if (confirm("Desea Eliminar los Datos?") == 1) {
        $.ajax(
            {
                type: "POST",
                url: "Curso/eliminar",
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
    if (datosObligatorios() == true)
    {
        var frm = new FormData();
        var id = document.getElementById("txtIdCurso").value;
        var nombre = document.getElementById("txtNombreCurso").value;
        var descripcion = document.getElementById("txtDescripcion").value;
        frm.append("IIDCURSO",id);
        frm.append("NOMBRE",nombre);
        frm.append("DESCRIPCION",descripcion);
        frm.append("BHABILITADO", 1);
        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "Curso/guardar",
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

function datosObligatorios()
{
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
