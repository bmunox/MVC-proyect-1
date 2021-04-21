
$("#dtFechaNacimiento").datepicker(
    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear:true
    }
);
listar();
function listar()
{

    $.get("Alumno/listarAlumno", function (data) {

        crearListado(["Id Alumno", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono Padre"], data);
    });
}

var nombreAlumno = document.getElementById("txtnombre");
nombreAlumno.onkeyup = function () {
    var nombre = document.getElementById("txtnombre").value;
    $.get("Alumno/buscarAlumnoPorNombre/?nombreAlumno=" + nombre, function (data) {
        crearListado(["Id Alumno", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono Padre"], data);
    });
}

var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.onclick = function () {
    var iidsexo = document.getElementById("cboSexo").value;
    if (iidsexo == '') {
        listar();
    }
    else
        $.get("Alumno/filtrarAlumnoPorSexo/?iidsexo=" + iidsexo, function (data) {
        crearListado(["Id Alumno", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono Padre"], data);
        });
}

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {
    listar();
    document.getElementById("txtnombre").value = "";
}

$.get("Alumno/listarSexo", function (data) {
    llenarCombo(data, document.getElementById("cboSexo"), true);
    llenarCombo(data, document.getElementById("cboSexoPopup"), true);
})


function llenarCombo(data, control, primerElemento)
{
    var contenido = "";
    if (primerElemento == true)
    {
        contenido += "<option value=''>--Seleccione--</option>";
    }
    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].IID + "'>";
        contenido += data[i].NOMBRE;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
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
        $.get("Alumno/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdAlumno").value = data[0].IIDALUMNO;
            document.getElementById("txtNombre").value = data[0].NOMBRE;
            document.getElementById("txtapPaterno").value = data[0].APPATERNO;
            document.getElementById("txtapMaterno").value = data[0].APMATERNO;
            document.getElementById("dtFechaNacimiento").value = data[0].FECHANACE;
            document.getElementById("cboSexoPopup").value = data[0].IIDSEXO;
            document.getElementById("txtnumeroHermanos").value = data[0].NUMEROHERMANOS;
            document.getElementById("txttelefonoPadre").value = data[0].TELEFONOPADRE;
            document.getElementById("txttelefonoMadre").value = data[0].TELEFONOMADRE;
        })
    }
}

function eliminar(id) {
    if (confirm("Desea Eliminar?")==1) {
        $.get("Alumno/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrio un Error!!");
            } else {
                alert("Se elimino correctamente");
                listar();
            }

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

function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIdAlumno").value;
        var nombre = document.getElementById("txtNombre").value;
        var apPaterno = document.getElementById("txtapPaterno").value;
        var apMaterno = document.getElementById("txtapMaterno").value;
        var fechaNace = document.getElementById("dtFechaNacimiento").value;
        var idSexo = document.getElementById("cboSexoPopup").value;
        var numHermanos = document.getElementById("txtnumeroHermanos").value;
        var telfPadre = document.getElementById("txttelefonoPadre").value;
        var telfMadre = document.getElementById("txttelefonoMadre").value;

        nombre = nombre.toUpperCase();
        apMaterno = apMaterno.toUpperCase();
        apPaterno = apPaterno.toUpperCase();

        frm.append("IIDALUMNO", id);
        frm.append("NOMBRE", nombre);
        frm.append("APPATERNO", apPaterno);
        frm.append("APMATERNO", apMaterno);
        frm.append("FECHANACIMIENTO", fechaNace);
        frm.append("IIDSEXO", idSexo);
        frm.append("NUMEROHERMANOS", numHermanos);
        frm.append("TELEFONOPADRE", telfPadre);
        frm.append("TELEFONOMADRE", telfMadre);
        frm.append("BHABILITADO", 1);

        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "Alumno/guardar",
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




