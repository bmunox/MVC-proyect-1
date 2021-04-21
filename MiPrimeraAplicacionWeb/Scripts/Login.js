var btnIngresar = document.getElementById("btnIngresar");
btnIngresar.onclick = function () {

    var usuario = document.getElementById("txtUsuario").value;
    var contra = document.getElementById("txtContra").value;
    if (usuario =="") {
        alert("Ingrese Usuario");
        return;
    }
    if (contra == "") {
        alert("Ingrese Contraseña");
        return;
    }
    $.get("Login/validarUsuario/?usuario=" + usuario + "&contra=" + contra, function (data) {
        if (data == 1) {
            document.location.href = "PaginaPrincipal/Index";

        } else {
            alert("Usuario o Contraseña Incorrecta");
        }
    })

}