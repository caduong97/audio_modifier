using System;
using audio_modifier.DTOs;
using audio_modifier.Helpers;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;

namespace audio_modifier.Controllers
{
	public class PitchController : BaseController
	{
		private readonly IPitchService _pitchService;

		public PitchController(ILogger<BaseController> logger, IConfiguration configuration, IPitchService pitchService) : base(logger, configuration)
		{
			_pitchService = pitchService;
		}

        [HttpPost]
        [RequestSizeLimit(536870912)]
        public async Task Index([FromForm] List<IFormFile> files, [FromQuery] PitchShiftRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                throw new Exception("Pitch shifting request model is not valid");
            }

            var result = _pitchService.PitchShiftAudio(files.First(), requestDto);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);

        }
    }
}

