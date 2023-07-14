using System;
namespace audio_modifier.DTOs
{
	public class AudioDto
	{
		public AudioDto()
		{
		}

		public string FileName { get; set; }
		public int SampleRate { get; set; }
		public int BitDepth { get; set; }
		public int Channels { get; set; }
		public TimeSpan Duration { get; set; } 

	}
}

