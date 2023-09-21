using System;
using audio_modifier.DTOs;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;

namespace audio_modifier.Services
{
	public interface IPitchService
	{
		AudioFileResult PitchShiftAudio(IFormFile file, PitchShiftRequestDto requestDto);
        AudioFileResult PitchShiftWav(IFormFile file, PitchShiftRequestDto requestDto);
    }

	public class PitchService : IPitchService
	{
		public PitchService()
		{
		}

        public AudioFileResult PitchShiftAudio(IFormFile file, PitchShiftRequestDto requestDto)
        {
            var fileExtension = Path.GetExtension(file.FileName);

            if (fileExtension == ".wav")
            {
                return PitchShiftWav(file, requestDto);
            }

            if (fileExtension == ".mp3")
            {
                throw new NotImplementedException();
            }

            throw new NotImplementedException();
        }

        public AudioFileResult PitchShiftWav(IFormFile file, PitchShiftRequestDto requestDto)
        {
            using var output = new MemoryStream();

            var semitone = Math.Pow(2, 1.0 / 12);
            var upOneTone = semitone * semitone;
            var downOneTone = 1.0 / upOneTone;

            using var reader = new WaveFileReader(file.OpenReadStream());

            var pitch = new SmbPitchShiftingSampleProvider(reader.ToSampleProvider());
            pitch.PitchFactor = (float)upOneTone;
            // Create a WaveFileWriter with the same format as the original WAV file
            using var writer = new WaveFileWriter(output, pitch.WaveFormat);

            try
            {
                var buffer = new float[4096];
                int bytesRead;

                while ((bytesRead = pitch.Read(buffer, 0, buffer.Length)) > 0)
                {
                    for (int i = 0; i < bytesRead; i += 4)
                    {
                        writer.WriteSample(buffer[i]);
                    }
                }

                writer.Flush();

                var fileByteArray = output.ToArray();
                var fileName = !string.IsNullOrWhiteSpace(requestDto.OutputFileName) ? requestDto.OutputFileName : requestDto.JobId.ToString();
                return new AudioFileResult()
                {
                    Name = fileName + ".wav",
                    ByteArray = fileByteArray
                };
            }
            catch (Exception e)
            {
                throw new Exception("Cannot shift the pitch of provided audio. Error: " + e);
            }

        }
    }
}

