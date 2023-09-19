using System;
using audio_modifier.DTOs;
using audio_modifier.Helpers;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;

namespace audio_modifier.Controllers
{
	public class ChannelController : BaseController
	{
		private readonly IChannelService _channelService;

		public ChannelController(ILogger<BaseController> logger, IConfiguration configuration, IChannelService channelService) : base(logger, configuration)
		{
			_channelService = channelService;
		}

		[HttpPost("stereoToMono")]
		public async Task StereoToMono([FromForm] List<IFormFile> files, [FromQuery] StereoToMonoRequestDto requestDto)
		{
            if (!ModelState.IsValid)
            {
                throw new Exception("Merge request model is not valid");
            }

			var result = _channelService.StereoToMono(files.First(), requestDto);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);
        }

        [HttpPost("monoToStereo")]
        public async Task MonoToStereo([FromForm] List<IFormFile> files, [FromQuery] MonoToStereoRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                throw new Exception("Merge request model is not valid");
            }

            var result = _channelService.MonoToStereo(files.First(), requestDto);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);
        }
    }
}

