using System;
using System.Reflection.PortableExecutable;
using audio_modifier.DTOs;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;

namespace audio_modifier.Services
{
	public interface ITrimService
	{
        AudioFileResult TrimAudio(IFormFile file, TrimAudioRequestDto requestDto);
    }
    public class TrimService : ITrimService
	{
		public TrimService()
		{
		}

        public AudioFileResult TrimAudio(IFormFile file, TrimAudioRequestDto requestDto)
        {
            var fileExtension = Path.GetExtension(file.FileName);

            if (fileExtension == ".wav")
            {
                return TrimWav(file, requestDto);
            }

            if (fileExtension == ".mp3")
            {
                throw new NotImplementedException();
            }

            throw new NotImplementedException();
        }

        /// <summary>
        /// Trim part of wav file.
        /// </summary>
        private AudioFileResult TrimWav(IFormFile file, TrimAudioRequestDto requestDto)
        {
            if (requestDto.Start == 0 && requestDto.End == 0)
            {
                throw new Exception("Cannot trim audio. Both start and end position is 0.");
            }

            using var output = new MemoryStream();

            using var reader = new WaveFileReader(file.OpenReadStream());
            var sampleProvider = new OffsetSampleProvider(reader.ToSampleProvider());

            var skipDuration = requestDto.Start;
            var takeDuration = requestDto.End - requestDto.Start;
            if (takeDuration < 0)
            {
                throw new Exception("Cannot trim audio. End postion is less than start position.");
            }

            // Specify the amount to skip, delay, take and lead out
            sampleProvider.SkipOver = TimeSpan.FromSeconds(skipDuration);
            sampleProvider.DelayBy = TimeSpan.FromSeconds(requestDto.LeadingSilence);
            sampleProvider.Take = TimeSpan.FromSeconds(takeDuration);
            sampleProvider.LeadOut = TimeSpan.FromSeconds(requestDto.TrailingSilence);

            var skipSamples = sampleProvider.SkipOverSamples;
            var takeSamples = sampleProvider.TakeSamples;

            // In case skip samples are larger than total samples in the original file..
            skipSamples = Math.Min(skipSamples, (int)reader.SampleCount * sampleProvider.WaveFormat.Channels);
            // If case take samples are larger than the remaining of total samples minus the skip samples...
            takeSamples = Math.Min(takeSamples, (int)reader.SampleCount * reader.WaveFormat.Channels - skipSamples);

            // Total sample must include the leading and trailing silence
            var totalSamples = sampleProvider.DelayBySamples + takeSamples + sampleProvider.LeadOutSamples;

            // Create a WaveFileWriter with the same format as the original WAV file
            using var writer = new WaveFileWriter(output, reader.WaveFormat);

            var buffer = new float[4096];
            int bytesRead;
            int amountSamplesWritten = 0;

            // Read and write the desired samples to the new WAV file
            while (amountSamplesWritten < totalSamples &&
                (bytesRead = sampleProvider.Read(buffer, 0, Math.Min(buffer.Length, (int)(totalSamples - amountSamplesWritten)))) > 0)
            {
                int samplesToWrite = Math.Min(bytesRead, (int)(totalSamples - amountSamplesWritten));

                // Write the samples to the output WAV file
                for (int i = 0; i < samplesToWrite; i++)
                {
                    writer.WriteSample(buffer[i]);
                }
                amountSamplesWritten += samplesToWrite;
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
    }
}

