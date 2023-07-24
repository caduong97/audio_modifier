using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using audio_modifier.DTOs;
using audio_modifier.Helpers;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace audio_modifier.Controllers
{
    public class MergeController : BaseController
    {
        private readonly IMergeService _mergeService;
        private readonly IAudioBasicService _audioBasicService;

        public MergeController(ILogger<BaseController> logger, IConfiguration configuration, IMergeService mergeService, IAudioBasicService audioBasicService) : base(logger, configuration)
        {
            _mergeService = mergeService;
            _audioBasicService = audioBasicService;
        }

        [HttpPost("preprocessWavFiles")]
        [RequestSizeLimit(536870912)]
        public IActionResult PreprocessWavFiles ([FromForm] List<IFormFile> files)
        {
            var audioDtos = files.Select(file => _audioBasicService.ProprocessWavAudioFiles(file));
            return Ok(audioDtos);
        }

        [HttpPost("preprocessMp3Files")]
        [RequestSizeLimit(536870912)]
        public IActionResult PreprocessMp3Files([FromForm] List<IFormFile> files)
        {
            var audioDtos = files.Select(file => _audioBasicService.ProprocessMp3AudioFiles(file));
            return Ok(audioDtos);
        }


        [HttpPost]
        [RequestSizeLimit(536870912)]
        public async Task Index([FromForm] List<IFormFile> files, [FromQuery] MergeAudioFilesRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                throw new Exception("Merge request model is not valid");
            }

            var result = _mergeService.MergeAudioFiles(files, requestDto);
            //using var fileStream = new MemoryStream(result.ByteArray);
            //fileStream.Seek(0, SeekOrigin.Begin);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);
            
        }

    }
}

