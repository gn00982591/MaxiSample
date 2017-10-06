using MaxiSample.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MaxiSample.Controllers
{
    public class BankController : Controller
    {
        #region Bank
        public ActionResult Bank() { return View(); }

        [HttpPost]
        public ActionResult Bank_S()
        {
            using (var db = CsFunc.DBExtend())
            { return Json(db.getBank().ToArray()).JsonExtMax(); }
        }

        [HttpPost]
        public ActionResult Bank_I(Bank_M obj)
        {
            using (var db = CsFunc.DBExtend())
            {
                var li = db.Bank_M.FirstOrDefault(s => s.cseq == obj.cseq);
                if (obj.cseq == 0 && li == null)
                {
                    obj.cseq = db.Bank_M.DefaultIfEmpty().Max(s => s == null ? 0 : s.cseq) + 1;
                    db.Bank_M.Add(obj);
                }
                else
                {
                    li.cname = obj.cname;
                    li.camount = obj.camount;
                    li.cenddt = obj.cenddt;
                    li.ctype = obj.ctype;
                    li.cdescq = obj.cdescq;
                }
                return Json(db.SaveChanges().MsgDone());
            }
        }
        [HttpPost]
        public ActionResult Bank_D(int? cseq)
        {
            using (var db = CsFunc.DBExtend())
            {
                var li = db.Bank_M.FirstOrDefault(s => s.cseq == cseq);
                db.Bank_M.Remove(li);
                return Json(db.SaveChanges().MsgDone());
            }
        }

        #endregion Bank
    }
}