using System;
using System.IO;
using System.Net;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Fit2Fitter.Database.Models;
using Fit2Fitter.Dto;
using Fit2Fitter.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Fit2FitterWebApp.Controllers
{
    [Route("api/[controller]")]
    public class UtilitiesController : Controller
    {
        public UtilitiesController()
        {   
        }

        [HttpGet("app/version")]
        public ActionResult GetFrontendVersion()
        {
            try
            {
                return this.Ok(new FrontendVersion());
            }
            catch (Exception ex)
            {
                return this.Ok(false);
            }
        }

        [HttpPost("image/ftp/upload")]
        public async Task<IActionResult> FtpUploadImage([FromBody, Required] byte[] imageData)
        {
            // Get the object used to communicate with the server.
            FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://ingeineur-001@ftp.site4now.net/Images/meals/test.jpg");
            request.Method = WebRequestMethods.Ftp.UploadFile;

            // This example assumes the FTP site uses anonymous logon.
            request.Credentials = new NetworkCredential("ingeineur-001", "Beatles1979");

            request.ContentLength = imageData.Length;


            using (Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(imageData, 0, imageData.Length);
            }

            using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
            {
                Console.WriteLine($"Upload File Complete, status {response.StatusDescription}");
            }

            return this.Ok(true);
        }

        [HttpPost("image/upload/mam")]
        public async Task<IActionResult> OnPostUploadAsync([FromBody, Required] List<IFormFile> files)
        {
            long size = files.Sum(f => f.Length);

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    var filePath = Path.GetTempFileName();

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            // Process uploaded files
            // Don't rely on or trust the FileName property without validation.

            return Ok(new { count = files.Count, size });
        }

        [HttpPost("image/avatar/upload")]
        public async Task<ActionResult> UploadAvatarImage([FromForm] FileModel file)
        {
            try
            {
                var filename = Guid.NewGuid().ToString() + Path.GetExtension(file.Filename);
                string path = Path.Combine(Directory.GetCurrentDirectory(), @"clientapp/build/images/avatars", filename);

                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    await file.FormFile.CopyToAsync(stream).ConfigureAwait(false);
                }

                return this.Ok(filename);
            }
            catch (Exception ex)
            {
                return this.Ok(string.Empty);
            }
        }

        [HttpPost("image/meal/upload")]
        public async Task<ActionResult> UploadImage([FromForm] FileModel file)
        {
            try
            {
                var filename = Guid.NewGuid().ToString() + Path.GetExtension(file.Filename);
                string path = Path.Combine(Directory.GetCurrentDirectory(), @"clientapp/build/images/meals", filename);

                using (Stream stream = new FileStream(path, FileMode.Create))
                {
                    await file.FormFile.CopyToAsync(stream).ConfigureAwait(false);
                }

                return this.Ok(filename);
            }
            catch (Exception ex)
            {
                return this.Ok(string.Empty);
            }
        }

        [HttpPost("image/meal/delete")]
        public ActionResult DeleteImage([FromForm] FileModel file)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), @"clientapp/build/images/meals", file.Filename);
                System.IO.File.Delete(path);
            }
            catch (Exception ex)
            {
                return this.Ok(false);
            }

            return this.Ok(true);
        }

        [HttpGet("image/meal")]
        public async Task<ActionResult> GetImage([FromForm] FileModel file)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "clientapp/build/images/meals", file.Filename);
                Byte[] b = await System.IO.File.ReadAllBytesAsync(path).ConfigureAwait(false);   // You can use your own method over here.         
                return this.Ok(File(b, "image/jpeg"));
            }
            catch (Exception ex)
            {
                return this.Ok(false);
            }
        }
    }
}
