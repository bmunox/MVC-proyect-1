using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
    public class RolPaginaController : Controller
    {
        // GET: RolPagina
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult listarRol()
        {
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var lista = bd.Rol.Where(p => p.BHABILITADO == 1)
                    .Select(p => new { 
                        p.IIDROL,
                        p.NOMBRE,
                        p.DESCRIPCION
                    }).ToList();
                return Json(lista, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult listarPagina()
        {
            using ( PruebaDataContext bd = new PruebaDataContext())
            {
                var lista = bd.Pagina.Where(p => p.BHABILITADO == 1)
                    .Select(p => new { 
                        p.IIDPAGINA,
                        p.MENSAJE,
                        p.CONTROLADOR,
                        p.BHABILITADO
                    }).ToList();
                return Json(lista, JsonRequestBehavior.AllowGet);
            }
        
        }
        public JsonResult ObtenerRol(int idRol)
        {
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var rol = bd.Rol.Where(p=> p.IIDROL== idRol && p.BHABILITADO==1)
                    .Select( p => new { 
                        p.IIDROL,
                        p.NOMBRE,
                        p.DESCRIPCION
                    }).First();
                return Json(rol, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult ObtenerRolPagina(int idRol)
        {
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var rolPagina = bd.RolPagina.Where(p => p.IIDROL == idRol && p.BHABILITADO == 1)
                    .Select(p => new {
                        p.IIDROL,
                        p.IIDPAGINA
                    }).ToList();
                return Json(rolPagina, JsonRequestBehavior.AllowGet);
            }
        }
        public int guardar(Rol oRolCLS, string dataEnviar)
        {
            
            int nregistrosAfectados = 0;
            try
            {
                using (PruebaDataContext bd = new PruebaDataContext()) 
                {
                    using (var transaccion = new TransactionScope())
                    {
                        //INSERTA UN REGISTRO TOTALMENTE NUEVO
                        if (oRolCLS.IIDROL == 0)
                        {
                            Rol oRol = new Rol();
                            oRol.NOMBRE = oRolCLS.NOMBRE;
                            oRol.DESCRIPCION = oRolCLS.DESCRIPCION;
                            oRol.BHABILITADO = oRolCLS.BHABILITADO;
                            bd.Rol.InsertOnSubmit(oRol);
                            bd.SubmitChanges();

                            string[] paginas = dataEnviar.Split('$');
                            for (int i = 0; i < paginas.Length; i++)
                            {
                                RolPagina oRolPagina = new RolPagina();
                                oRolPagina.IIDROL = oRol.IIDROL;
                                oRolPagina.IIDPAGINA = int.Parse(paginas[i]);
                                oRolPagina.BHABILITADO = 1;
                                bd.RolPagina.InsertOnSubmit(oRolPagina);
                            }
                            nregistrosAfectados = 1;
                            bd.SubmitChanges();
                            transaccion.Complete();
                        }
                        //MODIFICA UN REGISTRO EXISTENTE
                        else
                        {
                            Rol oRol = bd.Rol.Where(p => p.IIDROL.Equals(oRolCLS.IIDROL)).First();
                            oRol.NOMBRE = oRolCLS.NOMBRE;
                            oRol.DESCRIPCION = oRolCLS.DESCRIPCION;
                            //bd.SubmitChanges();
                            var listaP = bd.RolPagina.Where(p => p.IIDROL.Equals(oRolCLS.IIDROL));

                            foreach (RolPagina oRolPagina in listaP)
                            {
                                oRolPagina.BHABILITADO = 0;
                            }

                            string[] paginas = dataEnviar.Split('$');
                            for (int i = 0; i < paginas.Length; i++)
                            {
                                if (dataEnviar!="")
                                {
                                    int cantidad = bd.RolPagina.Where(p => p.IIDROL == oRolCLS.IIDROL 
                                    && p.IIDPAGINA == int.Parse(paginas[i])).Count();

                                    if (cantidad == 0)
                                    {
                                        RolPagina oRolPagina = new RolPagina();
                                        oRolPagina.IIDROL = oRol.IIDROL;
                                        oRolPagina.IIDPAGINA = int.Parse(paginas[i]);
                                        oRolPagina.BHABILITADO = 1;
                                        bd.RolPagina.InsertOnSubmit(oRolPagina);
                                    }
                                    else
                                    {
                                        RolPagina oRolPagina = bd.RolPagina.Where(p => p.IIDROL == oRolCLS.IIDROL
                                        && p.IIDPAGINA == int.Parse(paginas[i])).First();
                                        oRolPagina.BHABILITADO = 1;
                                    }
                                }
                                //bd.RolPagina.InsertOnSubmit(oRolPagina);
                                nregistrosAfectados = 1;
                            }
                            bd.SubmitChanges();
                            transaccion.Complete();
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }
    }
}