using System;
namespace audio_modifier.DTOs
{
	public class AudioWavDto : AudioBase
	{
		public AudioWavDto()
		{
		}
		
        public int BitDepth { get; set; }
        public int Channels { get; set; }
		public TimeSpan Duration { get; set; }


    }
}

