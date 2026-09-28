using M.Core.Base;
using M.Core.Store;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace M.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        private static readonly string[] AllowedExtensions =
            [".jpg", ".jpeg", ".png", ".webp"];
        private const long MaxBytes = 5 * 1024 * 1024; // 5MB

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Upload ảnh chấm công (vào ca / ra ca).
        /// Trả về đường dẫn tương đối /uploads/... để lưu vào CSDL.
        /// </summary>
        [HttpPost("photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return Ok(new BaseResponse<string>(
                    StatusCodeHelper.BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Vui lòng chọn file ảnh."));
            }

            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension) ||
                file.Length > MaxBytes)
            {
                return Ok(new BaseResponse<string>(
                    StatusCodeHelper.BadRequest,
                    ResponseCodeConstants.BAD_REQUEST,
                    "Chỉ chấp nhận jpg/png/webp, tối đa 5MB."));
            }

            string folder = DateTime.Now.ToString("yyyyMM");
            string fileName = $"{Guid.NewGuid()}{extension}";
            // Lưu vào wwwroot/uploads (PhotoStore tạo thư mục nếu chưa có,
            // fallback an toàn khi WebRootPath null)
            string uploadRoot = PhotoStore.GetRoot(_env);
            string absoluteDir = Path.Combine(uploadRoot, folder);
            Directory.CreateDirectory(absoluteDir);

            string absolutePath = Path.Combine(absoluteDir, fileName);
            await using (var stream = new FileStream(
                absolutePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Đường dẫn tĩnh (served qua /uploads) - lưu URL tuyệt đối vào DB
            string url = $"{Request.Scheme}://{Request.Host}" +
                $"/uploads/{folder}/{fileName}";

            return Ok(new BaseResponse<string>(
                StatusCodeHelper.OK,
                ResponseCodeConstants.SUCCESS,
                url));
        }
    }
}
