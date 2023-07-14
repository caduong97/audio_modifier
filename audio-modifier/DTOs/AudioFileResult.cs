using System;
namespace audio_modifier.DTOs
{
	public interface IFileResult {
		string Name { get; set; }
		byte[] ByteArray { get; set; }
	}

	public class AudioFileResult : IFileResult
	{
		public AudioFileResult()
		{
		}

		public string Name { get; set; }
		public byte[] ByteArray { get; set; }

	}
}

