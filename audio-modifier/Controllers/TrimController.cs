using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace audio_modifier.Controllers
{
    public class TrimController : BaseController
    {
        private readonly ITrimService _trimService;
        private readonly IAudioBasicService _audioBasicService;

        public TrimController(ILogger<BaseController> logger, IConfiguration configuration, ITrimService trimService, IAudioBasicService audioBasicService) : base(logger, configuration)
        {
            _trimService = trimService;
            _audioBasicService = audioBasicService;
        }

        [HttpPost("preprocessWavFile")]
        [RequestSizeLimit(536870912)]
        public IActionResult PreprocessWavFile([FromForm] IFormFile file)
        {
            var audioDto = _audioBasicService.ProprocessWavAudioFiles(file);
            return Ok(audioDto);
        }

        [HttpPost("preprocessMp3File")]
        [RequestSizeLimit(536870912)]
        public IActionResult PreprocessMp3Files([FromForm] IFormFile file)
        {
            var audioDto = _audioBasicService.ProprocessMp3AudioFiles(file);
            return Ok(audioDto);
        }
    }
}

