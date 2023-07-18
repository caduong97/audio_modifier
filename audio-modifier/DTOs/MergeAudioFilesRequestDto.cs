using System;
namespace audio_modifier.DTOs
{
	public class MergeAudioFilesRequestDto
	{
		public MergeAudioFilesRequestDto()
		{
		}

		public Guid JobId { get; set; }
		public float SharedInterval { get; set; }
		public string IndividualIntervals { get; set; }
		public float LeadingSilence { get; set; }
		public string? OutputFileName { get; set; }

		// TODO: fade in/out effect for each audio file


	}
}

