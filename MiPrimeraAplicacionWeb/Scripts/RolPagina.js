listar();

function listar() {
    $.get("RolPagina/listarRol", function (data) {
        crearListado(["Id Rol","Nombre","Descripcion"],data)
    })
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
var idRol = "";
var paginas = [];
function abrirModal(id) {
    idRol = id;
    var controlesObligatorio = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorio.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorio[i].parentNode.classList.remove("error");
    }
    if (id != 0) {
        obtenerPaginasRol();
    }
    else {
        paginas = [];
    }
    $.get("RolPagina/listarPagina", function (data) {
        SelectMultiple(data);
    });
    if (id == 0) {
        borrarDatos();
    }
}

function obtenerPaginasRol() {
    console.log(idRol);
    paginas = [];
    if (idRol != 0) {
        console.log("---- Entra ----");
        $.get("RolPagina/ObtenerRolPagina/?idRol=" + idRol, function (data) {
            $.get("RolPagina/listarPagina", function (data) {
                SelectMultiple(data);
            });
            console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                var valor = data[i].IIDPAGINA;
                valor = valor.toString();
                paginas[i] = valor;
            }
            console.log("---- Termina ----");
        })
    }

    $.get("RolPagina/ObtenerRol/?idRol=" + idRol, function (data) {
        document.getElementById("txtIdRol").value = data.IIDROL;
        document.getElementById("txtNombreRol").value = data.NOMBRE;
        document.getElementById("txtDescripcion").value = data.DESCRIPCION;
    })
}

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
}

function SelectMultiple(datos) {
    //Limpieza de la seleccion multiple
    var multiLimpieza = document.getElementsByClassName("select-pure__select select-pure__select--multiple");
    for (var i = 0; i < multiLimpieza.length; i++) {
        multiLimpieza[i].parentNode.removeChild(multiLimpieza[i]);
    }

    var myOptions = {
        'datos': []
    };
    //const myOptions2 = ['label','value'];
    for (var i = 0; i < datos.length; i++) {
        var valor = datos[i].IIDPAGINA;
        valor = valor.toString();
        myOptions.datos.push(
            {
                "label": datos[i].MENSAJE,
                "value": valor
            }
        );
    }
    console.log(paginas);
    var valores = [];
    for (var i = 0; i < paginas.length; i++) {
        //console.log("Si entra");
        valores.push(paginas[i]);
    }
    //console.log(idRol);
    console.log(valores);
    var multi = new SelectPure(".multi-select", {
        options: myOptions.datos,
        value: valores,
        multiple: true,
        icon: "fa fa-times",
        placeholder: "-Seleccionar-",
        onChange: value => { console.log(value);},
        classNames: {
            select: "select-pure__select",
            dropdownShown: "select-pure__select--opened",
            multiselect: "select-pure__select--multiple",
            label: "select-pure__label",
            placeholder: "select-pure__placeholder",
            dropdown: "select-pure__options",
            option: "select-pure__option",
            autocompleteInput: "select-pure__autocomplete",
            selectedLabel: "select-pure__selected-label",
            selectedOption: "select-pure__option--selected",
            placeholderHidden: "select-pure__placeholder--hidden",
            optionHidden: "select-pure__option--hidden",
        }
    });
    var resetMulti = function () {
        multi.reset();
    };
}


function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var idrol = document.getElementById("txtIdRol").value;
        var nombre = document.getElementById("txtNombreRol").value;
        var descripcion = document.getElementById("txtDescripcion").value;

        frm.append("IIDROL", idrol);
        frm.append("NOMBRE", nombre);
        frm.append("DESCRIPCION", descripcion);
        frm.append("BHABILITADO", 1);

        //Aqui va un for para leer lo que esta guarado en las variables
        var dataEnviar = "";
        var paginas = document.getElementsByClassName("fa fa-times");
        for (var i = 0; i < paginas.length; i++) {
            dataEnviar += paginas[i].dataset.value;
            dataEnviar += "$";
        }
        dataEnviar = dataEnviar.substring(0, dataEnviar.length - 1);
        console.log(dataEnviar);
        frm.append("dataEnviar", dataEnviar);

        if (confirm("Desea Guardar los Datos?") == 1) {
            $.ajax(
                {
                    type: "POST",
                    url: "RolPagina/guardar",
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
//function resetMulti() {
//    var multi = document.getElementsByClassName("multi-select");
//    multi.reset();
//}