using System;
namespace audio_modifier.DTOs
{
	public class MonoToStereoRequestDto
	{
		public MonoToStereoRequestDto()
		{
		}

        public Guid JobId { get; set; }
        public string? OutputFileName { get; set; }
    }
}

