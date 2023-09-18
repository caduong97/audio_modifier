using System;
using audio_modifier.DTOs;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;

namespace audio_modifier.Services
{
	public interface IChannelService
	{
		AudioFileResult StereoToMono(IFormFile file, StereoToMonoRequestDto requestDto);
    }

	public class ChannelService : IChannelService
	{
		public ChannelService()
		{
		}

        public AudioFileResult StereoToMono(IFormFile file, StereoToMonoRequestDto requestDto)
		{
            using var output = new MemoryStream();

            using var reader = new WaveFileReader(file.OpenReadStream());
            // Create a WaveFormat for mono audio
            var monoWaveFormat = new WaveFormat(reader.WaveFormat.SampleRate, 1);

            // Create a WaveFileWriter for the output mono WAV file
            using var writer = new WaveFileWriter(output, monoWaveFormat);

            try
            {
                // Create a WaveChannel32 to convert stereo to mono
                using var stereoToMonoStream = new WaveChannel32(reader);

                byte[] buffer = new byte[4096];
                int bytesRead;

                while ((bytesRead = reader.Read(buffer, 0, buffer.Length)) > 0)
                {
                    // Convert stereo to mono by averaging the left and right channels
                    for (int i = 0; i < bytesRead; i += 4)
                    {
                        // Assuming 16-bit audio format, little-endian
                        short leftSample = BitConverter.ToInt16(buffer, i);
                        short rightSample = BitConverter.ToInt16(buffer, i + 2);

                        // Average the left and right channels
                        short monoSample = (short)((leftSample + rightSample) / 2);

                        // Write the mono sample to the output stream
                        byte[] monoBytes = BitConverter.GetBytes(monoSample);
                        writer.Write(monoBytes, 0, monoBytes.Length);
                    }
                }

                output.Position = 0;
                writer.Flush();

                var fileByteArray = output.ToArray();
                var fileName = requestDto.OutputFileName != null ? requestDto.OutputFileName : requestDto.JobId.ToString();
                return new AudioFileResult()
                {
                    Name = fileName + ".wav",
                    ByteArray = fileByteArray
                };

            }
            catch (Exception e)
            {
                throw new Exception("Cannot convert stereo to mono audio. Error: " + e);
            }
		}

    }
}

