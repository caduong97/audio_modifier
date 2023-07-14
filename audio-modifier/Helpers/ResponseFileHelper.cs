using System;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using audio_modifier.DTOs;

namespace audio_modifier.Helpers
{
    public static class ResponseFileHelper
	{
        public static async Task WriteFileToResponseBody(HttpResponse response, IFileResult fileResult)
        {
            response.ContentType = "application/octet-stream";
            response.Headers.Add("Content-Disposition", $"attachment; filename=\"{fileResult.Name}\"");
            using (Stream bodyStream = response.BodyWriter.AsStream())
            {
                if (fileResult.ByteArray != null)
                {
                    using var fileStream = new MemoryStream(fileResult.ByteArray);
                    await fileStream.CopyToAsync(bodyStream);
                }
                else
                {
                    // TODO: add support for file result w/o ByteArray, then remove below line
                    throw new Exception("Cannot write file to response body. File is empty.");
                }
            }
        }
    }
}

