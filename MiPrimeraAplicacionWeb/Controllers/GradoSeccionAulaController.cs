using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class GradoSeccionAulaController : Controller
    {
        // GET: GradoSeccionAula
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarGradoSeccionAula()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from gsa in bd.GradoSeccionAula
                         join periodo in bd.Periodo
                             on gsa.IIDPERIODO equals periodo.IIDPERIODO
                         join gs in bd.GradoSeccion
                             on gsa.IIDGRADOSECCION equals gs.IID
                         join grado in bd.Grado
                            on gs.IIDGRADO equals grado.IIDGRADO
                         join curso in bd.Curso
                            on gsa.IIDCURSO equals curso.IIDCURSO
                         join docente in bd.Docente
                            on gsa.IIDDOCENTE equals docente.IIDDOCENTE
                         where gsa.BHABILITADO.Equals(1) &&
                             periodo.BHABILITADO.Equals(1) &&
                             curso.BHABILITADO.Equals(1) &&
                             docente.BHABILITADO.Equals(1) &&
                             grado.BHABILITADO.Equals(1)
                         select new
                         {
                             gsa.IID,
                             NOMBREPERIODO = periodo.NOMBRE,
                             NOMBREGRADO = grado.NOMBRE,
                             NOMBRECURSO = curso.NOMBRE,
                             NOMBREDOCENTE = docente.NOMBRE

                         }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Periodo.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new {
                   IID = p.IIDPERIODO,
                    p.NOMBRE
                })).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarAula()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Aula.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new {
                    IID = p.IIDAULA,
                    p.NOMBRE
                })).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarDocente()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Docente.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new {
                    IID = p.IIDDOCENTE,
                    p.NOMBRE
                })).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarCurso(int IIDPERIODO, int IIDGRADOSECCION)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int iidgrado = (int) bd.GradoSeccion.Where(p => p.IID.Equals(IIDGRADOSECCION)).First().IIDGRADO;
            var lista = from pgc in bd.PeriodoGradoCurso
                         join curso in bd.Curso
                            on pgc.IIDCURSO equals curso.IIDCURSO
                         join periodo in bd.Periodo
                            on pgc.IIDPERIODO equals periodo.IIDPERIODO
                        where pgc.BHABILITADO.Equals(1) &&
                        pgc.IIDPERIODO.Equals(IIDPERIODO) &&
                        pgc.IIDGRADO.Equals(iidgrado)
                        select new
                        {
                            IID = pgc.IIDCURSO,
                            curso.NOMBRE
                        };
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarGradoSeccion() 
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from gs in bd.GradoSeccion
                         join grado in bd.Grado
                            on gs.IIDGRADO equals grado.IIDGRADO
                         join seccion in bd.Seccion
                             on gs.IIDSECCION equals seccion.IIDSECCION
                         where gs.BHABILITADO.Equals(1) &&
                             grado.BHABILITADO.Equals(1) &&
                             seccion.BHABILITADO.Equals(1)
                         select new
                         {
                             gs.IID,
                             NOMBRE = grado.NOMBRE + " - " + seccion.NOMBRE
                         }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public int guardar(GradoSeccionAula oGradoSeccionAula)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                if (oGradoSeccionAula.IID == 0)
                {
                    bd.GradoSeccionAula.InsertOnSubmit(oGradoSeccionAula);
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
                else
                {
                    GradoSeccionAula obj = bd.GradoSeccionAula.Where(p => p.IID.Equals(oGradoSeccionAula.IID)).First();
                    obj.IIDPERIODO = oGradoSeccionAula.IIDPERIODO;
                    obj.IIDGRADOSECCION = oGradoSeccionAula.IIDGRADOSECCION;
                    obj.IIDCURSO = oGradoSeccionAula.IIDCURSO;
                    obj.IIDAULA = oGradoSeccionAula.IIDAULA;
                    obj.IIDDOCENTE = oGradoSeccionAula.IIDDOCENTE;
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
                GradoSeccionAula obj = bd.GradoSeccionAula.Where(p => p.IID.Equals(id)).First();
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
        public JsonResult recuperarDatos(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var obj = bd.GradoSeccionAula.Where(p => p.IID.Equals(id))
                .Select(p => new {
                    p.IID,
                    p.IIDPERIODO,
                    p.IIDGRADOSECCION,
                    p.IIDAULA,
                    p.IIDDOCENTE,
                    p.IIDCURSO
                }).ToList();

            return Json(obj, JsonRequestBehavior.AllowGet);
        }
    }
}