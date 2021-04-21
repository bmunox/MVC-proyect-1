listar();

function listar() {

    $.get("GradoSeccion/listarGradoSeccion", function (data) {

        crearListado(["Id Grado Seccion", "Nombre Grado", "Nombre Seccion"], data);
    })

    $.get("GradoSeccion/listarSeccion", function (data) {
        llenarCombo(data,  document.getElementById("cboSeccion"),true);
    })

    $.get("GradoSeccion/listarGrado", function (data) {
        llenarCombo(data, document.getElementById("cboGrado"), true);
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
        $.get("GradoSeccion/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdGradoSeccion").value = data[0].IID;
            document.getElementById("cboSeccion").value = data[0].IIDSECCION;
            document.getElementById("cboGrado").value = data[0].IIDGRADO;
        })
    }
}

function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIdGradoSeccion").value;
        var idGrado = document.getElementById("cboGrado").value;
        var idSeccion = document.getElementById("cboSeccion").value;


        frm.append("IID", id);
        frm.append("IIDGRADO", idGrado);
        frm.append("IIDSECCION", idSeccion);
        frm.append("BHABILITADO", 1);

        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "GradoSeccion/guardar",
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
        $.get("GradoSeccion/eliminar/?id=" + id, function (data) {
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
