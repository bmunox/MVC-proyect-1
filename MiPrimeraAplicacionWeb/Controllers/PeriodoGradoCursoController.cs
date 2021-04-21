using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class PeriodoGradoCursoController : Controller
    {
        // GET: PeriodoGradoCurso
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarPeriodoGradoCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = from pgcurso in bd.PeriodoGradoCurso
                        join tperiodo in bd.Periodo
                            on pgcurso.IIDPERIODO equals tperiodo.IIDPERIODO
                            //into test from tperiodo in test.Where(t => t.BHABILITADO.Equals(1))
                        join tgrado in bd.Grado
                            on pgcurso.IIDGRADO equals tgrado.IIDGRADO
                        join tcurso in bd.Curso
                            on pgcurso.IIDCURSO equals tcurso.IIDCURSO
                        where pgcurso.BHABILITADO.Equals(1) &&
                            tperiodo.BHABILITADO.Equals(1) &&
                            tcurso.BHABILITADO.Equals(1) &&
                            tgrado.BHABILITADO.Equals(1)
                        select new
                        {
                            pgcurso.IID,
                            NOMBREPERIODO = tperiodo.NOMBRE,
                            NOMBREGRADO = tgrado.NOMBRE,
                            NOMBRECURSO = tcurso.NOMBRE
                        };

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult recuperarDatos(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id))
                .Select(p => new {
                    p.IID,
                    p.IIDGRADO,
                    p.IIDCURSO,
                    p.IIDPERIODO
                }).ToList();

            return Json(obj, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1))
                    .Select(p => new {
                        IID = p.IIDCURSO,
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
        public JsonResult listarPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Periodo.Where(p => p.BHABILITADO.Equals(1))
                    .Select(p => new {
                        IID = p.IIDPERIODO,
                        p.NOMBRE
                    }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public int guardar(PeriodoGradoCurso oPeriodoGradoCurso)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                if (oPeriodoGradoCurso.IID == 0)
                {
                    bd.PeriodoGradoCurso.InsertOnSubmit(oPeriodoGradoCurso);
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
                else
                {
                    PeriodoGradoCurso obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(oPeriodoGradoCurso.IID)).First();
                    obj.IIDPERIODO = oPeriodoGradoCurso.IIDPERIODO;
                    obj.IIDGRADO = oPeriodoGradoCurso.IIDGRADO;
                    obj.IIDCURSO = oPeriodoGradoCurso.IIDCURSO;
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
                PeriodoGradoCurso obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).First();
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