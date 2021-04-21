using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class AlumnoController : Controller
    {
        // GET: Alumno
        PruebaDataContext bd = new PruebaDataContext();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarSexo()
        {
            var lista = bd.Sexo.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new { IID = p.IIDSEXO, p.NOMBRE }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarAlumno() 
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Alumno.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new 
                {
                    p.IIDALUMNO, 
                    p.NOMBRE, 
                    p.APPATERNO,
                    p.APMATERNO,
                    p.TELEFONOPADRE
                }).ToList();
            return Json(lista,JsonRequestBehavior.AllowGet);
        }
        public JsonResult buscarAlumnoPorNombre(string nombreAlumno)
        {
            PruebaDataContext bd = new PruebaDataContext();
            nombreAlumno = nombreAlumno.ToUpper();
            var lista = bd.Alumno.Where(p => p.BHABILITADO.Equals(1) && p.NOMBRE.Contains(nombreAlumno))
                .Select(p => new
                {
                    p.IIDALUMNO,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.TELEFONOPADRE
                }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);

        }
        public JsonResult filtrarAlumnoPorSexo(int iidsexo) 
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Alumno.Where(p => p.BHABILITADO.Equals(1) && p.IIDSEXO.Equals(iidsexo))
                .Select(p => new
                {
                    p.IIDALUMNO,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.TELEFONOPADRE
                }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public int eliminar(int id) 
        {
            PruebaDataContext db = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                Alumno olamuno = bd.Alumno.Where(p => p.IIDALUMNO.Equals(id)).First();
                olamuno.BHABILITADO = 0;
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
            var lista = bd.Alumno.Where(p => p.IIDALUMNO.Equals(id))
                .Select(p => new
                {
                    p.IIDALUMNO,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    FECHANACE = ((DateTime)p.FECHANACIMIENTO).ToShortDateString(),
                    p.IIDSEXO,
                    p.NUMEROHERMANOS,
                    p.TELEFONOPADRE,
                    p.TELEFONOMADRE
                }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public int guardar(Alumno oAlumno)
        {
            PruebaDataContext db = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                if (oAlumno.IIDALUMNO == 0)
                {
                    oAlumno.IIDALUMNO = 'A';
                    bd.Alumno.InsertOnSubmit(oAlumno);
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
                else
                {
                    Alumno obj = bd.Alumno.Where(p => p.IIDALUMNO.Equals(oAlumno.IIDALUMNO)).First();

                    obj.NOMBRE = oAlumno.NOMBRE;
                    obj.APMATERNO = oAlumno.APMATERNO;
                    obj.APPATERNO = oAlumno.APPATERNO;
                    obj.IIDSEXO = oAlumno.IIDSEXO;
                    obj.FECHANACIMIENTO = oAlumno.FECHANACIMIENTO;
                    obj.TELEFONOMADRE = oAlumno.TELEFONOMADRE;
                    obj.TELEFONOPADRE = oAlumno.TELEFONOPADRE;
                    obj.NUMEROHERMANOS = oAlumno.NUMEROHERMANOS;
                    obj.IIDALUMNO = 'A';
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
            }
            catch (Exception)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }
    }
}