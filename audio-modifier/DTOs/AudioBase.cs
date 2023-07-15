using System;
namespace audio_modifier.DTOs
{
	public class AudioBase
	{
		public AudioBase()
		{
		}

        public string FileName { get; set; }
        public int SampleRate { get; set; }
    }
}

