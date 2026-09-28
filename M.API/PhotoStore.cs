using Microsoft.AspNetCore.Hosting;

namespace M.API
{
    /// <summary>
    /// Thư mục lưu ảnh chấm công: wwwroot/uploads.
    /// Fallback sang ContentRootPath/wwwroot nếu WebRootPath null
    /// (trường hợp project chưa có thư mục wwwroot).
    /// </summary>
    public static class PhotoStore
    {
        public static string GetRoot(IWebHostEnvironment env)
        {
            string webRoot = string.IsNullOrEmpty(env.WebRootPath)
                ? Path.Combine(env.ContentRootPath, "wwwroot")
                : env.WebRootPath;
            Directory.CreateDirectory(webRoot);

            string uploadRoot = Path.Combine(webRoot, "uploads");
            Directory.CreateDirectory(uploadRoot);
            return uploadRoot;
        }
    }
}
