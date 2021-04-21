using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class GradoSeccionController : Controller
    {
        // GET: GradoSeccion
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarGradoSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from gradosec in bd.GradoSeccion
                            join sec in bd.Seccion
                                on gradosec.IIDSECCION equals sec.IIDSECCION
                            join grad in bd.Grado
                                on gradosec.IIDGRADO equals grad.IIDGRADO
                         where gradosec.BHABILITADO.Equals(1)
                         select new {
                            gradosec.IID,
                            NOMBREGRADO = grad.NOMBRE,
                            NOMBRESECCION = sec.NOMBRE
                        }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult recuperarDatos(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var obj= bd.GradoSeccion.Where(p => p.IID.Equals(id))
                .Select(p => new { 
                    p.IID,
                    p.IIDGRADO,
                    p.IIDSECCION
                } ).ToList();

            return Json(obj,JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarSeccion() 
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Seccion.Where(p => p.BHABILITADO.Equals(1))
                    .Select( p=> new { 
                       IID =  p.IIDSECCION,
                        p.NOMBRE
                    }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarGrado() 
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Grado.Where(p => p.BHABILITADO.Equals(1))
                    .Select(p => new {
                        IID = p.IIDGRADO,
                        p.NOMBRE
                    }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public int guardar(GradoSeccion oGradoSeccion) 
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                if (oGradoSeccion.IID == 0)
                {
                    bd.GradoSeccion.InsertOnSubmit(oGradoSeccion);
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
                else
                {
                    GradoSeccion obj = bd.GradoSeccion.Where(p => p.IID.Equals(oGradoSeccion.IID)).First();
                    obj.IIDSECCION = oGradoSeccion.IIDSECCION;
                    obj.IIDGRADO = oGradoSeccion.IIDGRADO;
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
            }
            catch (Exception ex)
            {

                nregistrosAfectados = 0;
            }

            return nregistrosAfectados;
        }
        public int eliminar(int id) 
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                GradoSeccion obj = bd.GradoSeccion.Where(p => p.IID.Equals(id)).First();
                obj.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception ex)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }
    }
}