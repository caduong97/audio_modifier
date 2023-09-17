using System;
using System.Reflection.PortableExecutable;
using audio_modifier.DTOs;
using NAudio.Wave;

namespace audio_modifier.Services
{
	public interface IAudioBasicService
	{
        AudioWavDto ProprocessWavAudioFile(IFormFile audioFile);
        AudioMp3Dto ProprocessMp3AudioFile(IFormFile audioFile);

        string WavToMp3(); 
	}

	public class AudioBasicService: IAudioBasicService
	{
		public AudioBasicService()
		{
		}

        public AudioWavDto ProprocessWavAudioFile(IFormFile audioFile)
        {
            using var reader = new WaveFileReader(audioFile.OpenReadStream());
            var format = reader.WaveFormat;

            var audioDto = new AudioWavDto()
            {
                FileName = audioFile.FileName,
                SampleRate = format.SampleRate,
                BitDepth = format.BitsPerSample,
                Channels = format.Channels,
                Duration = reader.TotalTime,
            };

            return audioDto;
        }

        public AudioMp3Dto ProprocessMp3AudioFile(IFormFile audioFile)
        {
            //var frame = Mp3Frame.LoadFromStream(audioFile.OpenReadStream());

            //var audioDto = new AudioMp3Dto()
            //{
            //    FileName = audioFile.FileName,
            //    SampleRate = frame.SampleRate,
            //    Format = frame.MpegVersion.ToString(),
            //    BitRate = frame.BitRate,
            //    ChannelMode = frame.ChannelMode.ToString(),
            //    Layer = frame.MpegLayer.ToString(),
            //    Copyright = frame.Copyright
            //};

            //return audioDto;

            throw new NotImplementedException();
        }



        public string WavToMp3()
        {
            throw new NotImplementedException();
        }
    }
}

