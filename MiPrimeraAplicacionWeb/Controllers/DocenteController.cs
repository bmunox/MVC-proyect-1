using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class DocenteController : Controller
    {
        // GET: Docente
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarDocente()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from docente in bd.Docente
                         where docente.BHABILITADO.Equals(1)
                         select new
                         {
                             docente.IIDDOCENTE,
                             docente.NOMBRE,
                             docente.APPATERNO,
                             docente.APMATERNO,
                             docente.EMAIL
                         }).ToList();

            var lista2 = bd.Docente.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                { p.IIDDOCENTE,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.EMAIL
                }).ToList();
/*
            string comando = $"SELECT IIDDOCENTE, NOMBRE,APPATERNO, APMATERNO, EMAIL FROM Docente";

            try
            {
                var query = bd.Docente.Where(x => x.IIDDOCENTE.Equals(1)).FirstOrDefault();
                query.NOMBRE = "Jason";
                bd.SubmitChanges();
                bd.Dispose();

                //Concaternar String de manera pro

                string saludo = "Hola ";
                string nombre = "Jason";
                string saludoCompleto = $"{saludo} {nombre}, saluda al mundo";

            }
            catch (Exception e)
            {
                string error = e.Message;
            }
*/

            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult filtrarDocentePorModalidad(int iidmodalidad)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from docente in bd.Docente
                         where docente.BHABILITADO.Equals(1) 
                         && docente.IIDMODALIDADCONTRATO.Equals(iidmodalidad)
                         select new
                         {
                             docente.IIDDOCENTE,
                             docente.NOMBRE,
                             docente.APPATERNO,
                             docente.APMATERNO,
                             docente.EMAIL
                         }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult listarModalidadContrato() 
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.ModalidadContrato.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    IID = p.IIDMODALIDADCONTRATO,
                    p.NOMBRE
                }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public int eliminar(int id) 
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                Docente oDocente = bd.Docente.Where(p => p.IIDDOCENTE.Equals(id)).First();
                oDocente.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception ex)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }
        public int guardar(Docente oDocente, string cadenaFoto)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                if (oDocente.IIDDOCENTE == 0)
                {
                    oDocente.FOTO = Convert.FromBase64String(cadenaFoto);
                    oDocente.IIDTIPOUSUARIO = 'D';
                    bd.Docente.InsertOnSubmit(oDocente);
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }
                else
                {
                    Docente obj = bd.Docente.Where(p => p.IIDDOCENTE.Equals(oDocente.IIDDOCENTE)).First();
                    obj.NOMBRE = oDocente.NOMBRE;
                    obj.APMATERNO = oDocente.APMATERNO;
                    obj.APPATERNO = oDocente.APPATERNO;
                    obj.IIDSEXO = oDocente.IIDSEXO;
                    obj.IIDMODALIDADCONTRATO = oDocente.IIDMODALIDADCONTRATO;
                    obj.DIRECCION = oDocente.DIRECCION;
                    obj.EMAIL = oDocente.EMAIL;
                    obj.FECHACONTRATO = oDocente.FECHACONTRATO;
                    obj.TELEFONOFIJO = oDocente.TELEFONOFIJO;
                    obj.TELEFONOCELULAR = oDocente.TELEFONOCELULAR;
                    obj.FOTO = Convert.FromBase64String(cadenaFoto);
                    oDocente.IIDTIPOUSUARIO = 'D';
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
        public JsonResult recuperarDatos(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Docente.Where(p => p.IIDDOCENTE.Equals(id))
                .Select(p => new { 
                    p.IIDDOCENTE,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.DIRECCION,
                    p.TELEFONOCELULAR,
                    p.TELEFONOFIJO,
                    p.IIDSEXO,
                    p.EMAIL,
                    FECHACONTRATO = ((DateTime)p.FECHACONTRATO).ToShortDateString(),
                    p.IIDMODALIDADCONTRATO,
                    FOTO64 = Convert.ToBase64String(p.FOTO.ToArray())
                });
            return Json(lista,JsonRequestBehavior.AllowGet);
        }
    }
}