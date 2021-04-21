using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class SeccionController : Controller
    {
        // GET: Seccion
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Seccion.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    p.IIDSECCION,
                    p.NOMBRE
                }
                )).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult buscarSeccionPorNombre( string nombreSeccion)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Seccion.Where(p => p.BHABILITADO.Equals(1) && p.NOMBRE.Contains(nombreSeccion))
                .Select(p => new
                {
                    p.IIDSECCION,
                    p.NOMBRE
                }
                )).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
    }
}