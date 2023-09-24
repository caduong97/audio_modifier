using System;
using audio_modifier.DTOs;
using audio_modifier.Helpers;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;

namespace audio_modifier.Controllers
{
	public class FadeController : BaseController
	{
		private readonly IFadeService _fadeService;

		public FadeController(ILogger<BaseController> logger, IConfiguration configuration, IFadeService fadeService) : base(logger, configuration)
		{
			_fadeService = fadeService;
		}

		[HttpPost("inout")]
		public async Task FadeInOut([FromForm] List<IFormFile> files, [FromQuery] FadeInOutRequestDto requestDto)
		{
            if (!ModelState.IsValid)
            {
                throw new Exception("Fade in out request model is not valid");
            }

            var result = _fadeService.FadeInOut(files.First(), requestDto);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);
        }
	}
}

