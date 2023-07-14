using System;
using audio_modifier.DTOs;
using NAudio.Wave;

namespace audio_modifier.Services
{
	public interface IAudioBasicService
	{
		AudioDto PreprocessAudio(IFormFile audioFile);
		string WavToMp3(); 
	}

	public class AudioBasicService: IAudioBasicService
	{
		public AudioBasicService()
		{
		}

        public AudioDto PreprocessAudio(IFormFile audioFile)
        {
            using var reader = new WaveFileReader(audioFile.OpenReadStream());
            var format = reader.WaveFormat;

            var audioDto = new AudioDto()
            {
                FileName = audioFile.FileName,
                SampleRate = format.SampleRate,
                BitDepth = format.BitsPerSample,
                Channels = format.Channels,
                Duration = reader.TotalTime,
            };

            return audioDto;
        }

        public string WavToMp3()
        {
            throw new NotImplementedException();
        }
    }
}

