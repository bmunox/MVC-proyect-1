listar();

var periodo = document.getElementById("cboPeriodo");
var gradoseccion = document.getElementById("cboGradoSeccion");

periodo.onchange = function () {
    var valPeriodo = periodo.value;
    var valGrado = gradoseccion.value;

    if (periodo.value != "" && gradoseccion.value != "") {
        $.get("GradoSeccionAula/listarCurso?IIDPERIODO=" + valPeriodo + "&IIDGRADOSECCION=" + valGrado, function (data) {
            llenarCombo(data, document.getElementById("cboCurso"), true);
        })
    }
}

gradoseccion.onchange = function () {
    var valPeriodo = periodo.value;
    var valGrado = gradoseccion.value;

    if (periodo.value != "" && gradoseccion.value != "") {
        $.get("GradoSeccionAula/listarCurso?IIDPERIODO=" + valPeriodo + "&IIDGRADOSECCION=" + valGrado, function (data) {
            llenarCombo(data, document.getElementById("cboCurso"), true);
        })
    }
}

function listar() {
    $.get("GradoSeccionAula/listarGradoSeccionAula", function (data) {
        crearListado(["ID", "PERIODO", "GRADO", "CURSO","DOCENTE"], data)
    })
    $.get("GradoSeccionAula/listarPeriodo", function (data) {
        llenarCombo(data, document.getElementById("cboPeriodo"), true);
    })
    $.get("GradoSeccionAula/listarGradoSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboGradoSeccion"), true);
    })
    $.get("GradoSeccionAula/listarDocente", function (data) {
        llenarCombo(data, document.getElementById("cboDocente"), true);
    })
    $.get("GradoSeccionAula/listarAula", function (data) {
        llenarCombo(data, document.getElementById("cboAula"), true);
    })
}

function llenarCombo(data, control, primerElemento) {
    var contenido = "";
    if (primerElemento == true) {
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

function abrirModal(id) {
    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    if (id == 0) {
        borrarDatos();
    } else {
        $.get("GradoSeccionAula/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdGradoSeccionAula").value = data[0].IID;
            document.getElementById("cboPeriodo").value = data[0].IIDPERIODO;
            document.getElementById("cboGradoSeccion").value = data[0].IIDGRADOSECCION;
            //document.getElementById("cboCurso").value = data[0].IIDCURSO;
            $.get("GradoSeccionAula/listarCurso?IIDPERIODO=" + periodo.value + "&IIDGRADOSECCION=" + gradoseccion.value, function (rpta) {
                llenarCombo(rpta, document.getElementById("cboCurso"), true);
                document.getElementById("cboCurso").value = data[0].IIDCURSO;
            })

            document.getElementById("cboAula").value = data[0].IIDAULA;
            document.getElementById("cboDocente").value = data[0].IIDDOCENTE;
        })
    }
}

function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIdGradoSeccionAula").value;
        var idPeriodo = document.getElementById("cboPeriodo").value;
        var idGradoSeccion = document.getElementById("cboGradoSeccion").value;
        var idCurso = document.getElementById("cboCurso").value;
        var idAula = document.getElementById("cboAula").value;
        var idDocente = document.getElementById("cboDocente").value;


        frm.append("IID", id);
        frm.append("IIDPERIODO", idPeriodo);
        frm.append("IIDGRADOSECCION", idGradoSeccion);
        frm.append("IIDCURSO", idCurso);
        frm.append("IIDAULA", idAula);
        frm.append("IIDDOCENTE", idDocente);
        frm.append("BHABILITADO", 1);

        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "GradoSeccionAula/guardar",
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

function eliminar(id) {
    if (confirm("Desea Eliminar?") == 1) {
        $.get("GradoSeccionAula/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrio un Error!!");
            } else {
                alert("Se elimino correctamente!!");
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
