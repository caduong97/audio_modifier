using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using audio_modifier.DTOs;
using audio_modifier.Helpers;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace audio_modifier.Controllers
{
    public class TrimController : BaseController
    {
        private readonly ITrimService _trimService;

        public TrimController(ILogger<BaseController> logger, IConfiguration configuration, ITrimService trimService) : base(logger, configuration)
        {
            _trimService = trimService;
        }


        [HttpPost]
        [RequestSizeLimit(536870912)]
        public async Task Index([FromForm] List<IFormFile> files, [FromQuery] TrimAudioRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                throw new Exception("Trim request model is not valid");
            }

            var result = _trimService.TrimAudio(files.First(), requestDto);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);

        }
    }
}

