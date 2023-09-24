using System;
namespace audio_modifier.DTOs
{
	public class FadeInOutRequestDto
	{
		public FadeInOutRequestDto()
		{
		}

		public Guid JobId { get; set; }
		public float FadeIn { get; set; } // In seconds
		public float FadeOut { get; set; } // In seconds
		public string? OutputFileName { get; set; }
    }
}

