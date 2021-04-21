$("#dtFechaContrato").datepicker(
    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
    }
);
listar();
listarComboModalidad();

function listarComboModalidad()
{
    $.get("Docente/listarModalidadContrato", function (data) {
        llenarCombo(data, document.getElementById("cboTipoModalidad"), true);
        llenarCombo(data, document.getElementById("cboModalidadContratoPopup"), true);
    })
}
$.get("Alumno/listarSexo", function (data) {
    llenarCombo(data, document.getElementById("cboSexoPopup"), true);
})

var cboTipoModalidad = document.getElementById("cboTipoModalidad");
cboTipoModalidad.onchange = function () {
    var iidmodalidad = document.getElementById("cboTipoModalidad").value;
    if (iidmodalidad == "") {
        listar();
    } else {
        $.get("Docente/filtrarDocentePorModalidad/?iidmodalidad=" + iidmodalidad, function (data) {
            crearListado(["Id Docente", "Nombre", "Apellido Paterno", "Apellido Materno", "Email"], data);
        });
    }
}

function listar() {

    $.get("Docente/listarDocente", function (data) {

        crearListado(["Id Docente", "Nombre", "Apellido Paterno", "Apellido Materno", "Email"], data);
    });
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

function abrirModal(id) {
    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }

    //var input = $("#btnFoto")
    $('#btnFoto').val('');
    //input.replaceWith(input.val('').clone(true));

    if (id == 0) {
        borrarDatos();
    } else {
        $.get("Docente/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIdDocente").value = data[0].IIDDOCENTE;
            document.getElementById("txtNombre").value = data[0].NOMBRE;
            document.getElementById("txtapPaterno").value = data[0].APPATERNO;
            document.getElementById("txtapMaterno").value = data[0].APMATERNO;
            document.getElementById("dtFechaContrato").value = data[0].FECHACONTRATO;
            document.getElementById("cboSexoPopup").value = data[0].IIDSEXO;
            document.getElementById("cboModalidadContratoPopup").value = data[0].IIDMODALIDADCONTRATO;
            document.getElementById("txtEmail").value = data[0].EMAIL;
            document.getElementById("txtdireccion").value = data[0].DIRECCION;
            document.getElementById("txttelefonoCelular").value = data[0].TELEFONOCELULAR;
            document.getElementById("txttelefonoFijo").value = data[0].TELEFONOFIJO;
            document.getElementById("imgFoto").src = "data:image/png;base64,"+data[0].FOTO64;
        })
    }
}

function eliminar(id) {
    if (confirm("Desea Eliminar?") == 1) {
        $.get("Docente/eliminar/?id=" + id, function (data) {
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

function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIdDocente").value;
        var nombre = document.getElementById("txtNombre").value;
        var apPaterno = document.getElementById("txtapPaterno").value;
        var apMaterno = document.getElementById("txtapMaterno").value;
        var fechaContrato = document.getElementById("dtFechaContrato").value;
        var idSexo = document.getElementById("cboSexoPopup").value;
        var idContrato = document.getElementById("cboModalidadContratoPopup").value;
        var email = document.getElementById("txtEmail").value;
        var direccion = document.getElementById("txtdireccion").value;
        var telCelular = document.getElementById("txttelefonoCelular").value;
        var telFijo = document.getElementById("txttelefonoFijo").value;
        var imgFoto = document.getElementById("imgFoto").src;
        imgFoto = imgFoto.substr(imgFoto.indexOf(',') + 1);

        nombre = nombre.toUpperCase();
        apMaterno = apMaterno.toUpperCase();
        apPaterno = apPaterno.toUpperCase();

        frm.append("IIDDOCENTE", id);
        frm.append("NOMBRE", nombre);
        frm.append("APPATERNO", apPaterno);
        frm.append("APMATERNO", apMaterno);
        frm.append("FECHACONTRATO", fechaContrato);
        frm.append("IIDSEXO", idSexo);
        frm.append("IIDMODALIDADCONTRATO", idContrato);
        frm.append("TELEFONOCELULAR", telCelular);
        frm.append("TELEFONOFIJO", telFijo);
        frm.append("EMAIL", email);
        frm.append("DIRECCION", direccion);
        frm.append("CADENAFOTO", imgFoto);
        frm.append("BHABILITADO", 1);

        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "Docente/guardar",
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

var btnFoto = document.getElementById("btnFoto");
btnFoto.onchange = function (e) {
    var file = document.getElementById("btnFoto").files[0];
    var reader = new FileReader();
    if (reader != null) {
        reader.onloadend = function () {
            var img = document.getElementById("imgFoto");
            //Con metadata metadata
            img.src = reader.result;
            //Sin metadata
            //img.src = reader.result.substr(reader.result.indexOf(',') + 1);
            //console.log(reader.result);
            //var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
            //console.log(base64result);
        }
    }
    reader.readAsDataURL(file);
}


