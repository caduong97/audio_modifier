using System;
namespace audio_modifier.DTOs
{
	public class TrimAudioRequestDto
	{
		public TrimAudioRequestDto()
		{
		}

		public Guid JobId { get; set; }
		public float LeadingSilence { get; set; }
		public double Start { get; set; }
		public double End { get; set; }
		public float TrailingSilence { get; set; }
		public string? OutputFileName { get; set; }
	}
}

