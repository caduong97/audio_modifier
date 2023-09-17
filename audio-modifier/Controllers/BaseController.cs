using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace audio_modifier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        private readonly ILogger? _logger;
        public IConfiguration _configuration;


        public BaseController(ILogger<BaseController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        protected IAudioBasicService _audioBasicService => HttpContext.RequestServices.GetRequiredService<IAudioBasicService>();

        [HttpPost("preprocessWavFiles")]
        [RequestSizeLimit(536870912)]
        public virtual IActionResult PreprocessWavFiles([FromForm] List<IFormFile> files)
        {
            var audioDtos = files.Select(file => _audioBasicService.ProprocessWavAudioFiles(file));
            return Ok(audioDtos);
        }

        [HttpPost("preprocessWavFile")]
        [RequestSizeLimit(536870912)]
        public virtual IActionResult PreprocessWavFile([FromForm] IFormFile file)
        {
            var audioDto = _audioBasicService.ProprocessWavAudioFiles(file);
            return Ok(audioDto);
        }

        [HttpPost("preprocessMp3Files")]
        [RequestSizeLimit(536870912)]
        public virtual IActionResult PreprocessMp3Files([FromForm] List<IFormFile> files)
        {
            var audioDtos = files.Select(file => _audioBasicService.ProprocessMp3AudioFiles(file));
            return Ok(audioDtos);
        }

        [HttpPost("preprocessMp3File")]
        [RequestSizeLimit(536870912)]
        public virtual IActionResult PreprocessMp3Files([FromForm] IFormFile file)
        {
            var audioDto = _audioBasicService.ProprocessMp3AudioFiles(file);
            return Ok(audioDto);
        }

    }
}

