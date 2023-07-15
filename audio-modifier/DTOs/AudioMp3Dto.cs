using System;

namespace audio_modifier.DTOs
{
	public class AudioMp3Dto : AudioBase
	{
		public AudioMp3Dto()
		{
		}

		public string Format { get; set; }
		public string Layer { get; set; }
        public int BitRate { get; set; }
        public string ChannelMode { get; set; }
		public bool Copyright { get; set; }

	}	
}

