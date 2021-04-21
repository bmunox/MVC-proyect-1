using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PaginaPrincipalController : Controller
    {
        // GET: PaginaPrincipal
        public ActionResult Index()
        {
            int idUsuario = (int)Session["idUsuario"];
            char tipoUsuario = (char)Session["tipoUsuario"];

            using (PruebaDataContext bd = new PruebaDataContext())
            {
                string nombreCompleto = "";
                Usuario usu = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario).First();
                if (usu.TIPOUSUARIO == 'D')
                {
                    Docente odocente = bd.Docente.Where(p => p.IIDDOCENTE == usu.IID).First();
                    nombreCompleto = odocente.NOMBRE + " " + odocente.APPATERNO + " " + odocente.APMATERNO;
                }
                else
                {
                    Alumno oalumno = bd.Alumno.Where(p => p.IIDALUMNO == usu.IID).First();
                    nombreCompleto = oalumno.NOMBRE + " " + oalumno.APPATERNO + " " + oalumno.APMATERNO;
                }
                ViewBag.nombreCompleto = nombreCompleto;
            }
            return View();
        }
    }
}