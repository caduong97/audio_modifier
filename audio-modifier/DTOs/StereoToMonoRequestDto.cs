using System;
namespace audio_modifier.DTOs
{
	public class StereoToMonoRequestDto
	{
		public StereoToMonoRequestDto()
		{
		}

        public Guid JobId { get; set; }
        public string? OutputFileName { get; set; }
    }
}

