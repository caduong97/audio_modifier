using System;
using audio_modifier.DTOs;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;

namespace audio_modifier.Services
{
	public interface IFadeService
	{
		AudioFileResult FadeInOut(IFormFile file, FadeInOutRequestDto requestDto);
	}

	public class FadeService : IFadeService
	{
		public FadeService()
		{
		}

        public AudioFileResult FadeInOut(IFormFile file, FadeInOutRequestDto requestDto)
        {
            var fileExtension = Path.GetExtension(file.FileName);

            if (fileExtension == ".wav")
            {
                return FadeInOutWav(file, requestDto);
            }

            if (fileExtension == ".mp3")
            {
                throw new NotImplementedException();
            }

            throw new NotImplementedException();
        }

        private AudioFileResult FadeInOutWav(IFormFile file, FadeInOutRequestDto requestDto)
        {
            using var output = new MemoryStream();

            using var reader = new WaveFileReader(file.OpenReadStream());
            var sampleProvider = new FadeInOutSampleProvider(reader.ToSampleProvider());

            var fadeInMilliseconds = TimeSpan.FromSeconds(requestDto.FadeIn).TotalMilliseconds;
            var fadeOutMilliseconds = TimeSpan.FromSeconds(requestDto.FadeOut).TotalMilliseconds;

            // Begin fade in
            sampleProvider.BeginFadeIn(fadeInMilliseconds);

            // Create a WaveFileWriter with the same format as the original WAV file
            using var writer = new WaveFileWriter(output, reader.WaveFormat);

            try
            {
                var buffer = new float[reader.WaveFormat.SampleRate * reader.WaveFormat.Channels];
                int bytesRead;

                // Calculate the sample position where the fade-out should start
                var fadeOutStartSample = (long)((reader.TotalTime.TotalSeconds - requestDto.FadeOut) * reader.WaveFormat.SampleRate * reader.WaveFormat.Channels);

                // Calculate the fraction which must divide to, to get the reader position in sample 
                // Amount of bits per sample / 8 (to get the bytes) THEN * channel count
                var positionLengthToSampleFraction = reader.WaveFormat.BitsPerSample / 8 * reader.WaveFormat.Channels;

                while ((bytesRead = sampleProvider.Read(buffer, 0, buffer.Length)) > 0)
                {
                    var readerPositionSample = reader.Position / positionLengthToSampleFraction;

                    // Check if we need to start the fade-out
                    if (reader.Position/positionLengthToSampleFraction >= fadeOutStartSample)
                    {
                        // Calculate the fade-out factor based on the remaining duration
                        var remainingDuration = reader.TotalTime.TotalSeconds - reader.CurrentTime.TotalSeconds;
                        var fadeOutFactor = (float)(remainingDuration / requestDto.FadeOut);

                        // Apply fade-out effect
                        for (int n = 0; n < bytesRead; n++)
                        {
                            buffer[n] *= fadeOutFactor;
                        }
                    }

                    writer.WriteSamples(buffer, 0, bytesRead);
                }

                output.Position = 0;
                writer.Flush();
            }
            catch (Exception e)
            {
                throw new Exception("Cannot fade in and out of provided audio. Error: " + e);
            }


            var fileByteArray = output.ToArray();
            var fileName = !string.IsNullOrWhiteSpace(requestDto.OutputFileName) ? requestDto.OutputFileName : requestDto.JobId.ToString();
            return new AudioFileResult()
            {
                Name = fileName + ".wav",
                ByteArray = fileByteArray
            };
        }
    }
}

