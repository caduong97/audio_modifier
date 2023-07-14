using System;
using audio_modifier.DTOs;
using Microsoft.AspNetCore.Mvc;
using NAudio.Wave;

namespace audio_modifier.Services
{
    public interface IMergeService
    {
        AudioFileResult MergeAudioFiles(List<IFormFile> files, MergeAudioFilesRequestDto requestDto);
    }
    public class MergeService : IMergeService
	{
		public MergeService()
		{
		}

        public AudioFileResult MergeAudioFiles(List<IFormFile> files, MergeAudioFilesRequestDto requestDto)
        {
            var fileExtensions = files.Select(file => Path.GetExtension(file.FileName));
            bool allSameExtension = fileExtensions.All(x => x == fileExtensions.First());

            if (!allSameExtension)
            {
                throw new Exception("Cannot merge audio files. All files must have the same extension.");
            }

            if (fileExtensions.First() == ".wav")
            {
                var result = MergeWavFiles(files, requestDto);
                return result;
            }
            if (fileExtensions.First() == ".mp3")
            {

            }


            throw new NotImplementedException();
        }

        /// <summary>
        /// Merge (concatenate) wav files.
        /// TODO: resample wav files if inconsistent sample rates amongst input files
        /// </summary>
        private AudioFileResult MergeWavFiles(List<IFormFile> files, MergeAudioFilesRequestDto requestDto)
        {
            using var output = new MemoryStream();

            // FOR NOW: Hard-code wave format with most standard sample rate, bit depth & channel count
            // TODO: decide what wave format from the input files (maybe take the most common sample rate)
            WaveFormat outputWaveFormat = new WaveFormat(44100, 16, 2);

            try
            {
                using var writer = new WaveFileWriter(output, outputWaveFormat);
                var buffer = new byte[outputWaveFormat.AverageBytesPerSecond * 4];

                foreach (var file in files)
                {
                    using var reader = new WaveFileReader(file.OpenReadStream());
                    var format = reader.WaveFormat;
                    if (format.SampleRate != outputWaveFormat.SampleRate || format.BitsPerSample != outputWaveFormat.BitsPerSample || format.Channels != outputWaveFormat.Channels)
                    {
                        // FOR NOW: throw error
                        // TODO: resample first using the unified sample rate
                        throw new Exception("Cannot merge audio files. Audio files don't have the same sample rate, bit depth (bits per sample) or channel count.");
                    }

                    int read;
                    while ((read = reader.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        writer.Write(buffer, 0, buffer.Length);
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
                throw new Exception("Cannot merge audio files. Error: " + e);
            }


        }
    }
}

