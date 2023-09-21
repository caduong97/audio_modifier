using System;
namespace audio_modifier.DTOs
{
	public class PitchShiftRequestDto
	{
		public PitchShiftRequestDto()
		{
		}

		public Guid JobId { get; set; }
		public float Pitch { get; set; }
		public string? OutputFileName { get; set; }
	}
}


