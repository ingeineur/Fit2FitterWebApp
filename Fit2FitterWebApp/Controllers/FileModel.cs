namespace Fit2FitterWebApp.Controllers
{
    public class FileModel
    {
        public string Filename { get; set; }
        public Microsoft.AspNetCore.Http.IFormFile FormFile { get; set; }
    }
}
