using System;
using audio_modifier.DTOs;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using NAudio.Lame;
using NAudio.Wave;
using NLayer.NAudioSupport;

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
                var result = MergeMp3Files(files, requestDto);
                return result;
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
                throw new Exception("Cannot merge wav files. Error: " + e);
            }


        }

        /// <summary>
        /// Merge (concatenate) mp3 files.
        /// </summary>
        private AudioFileResult MergeMp3Files(List<IFormFile> files, MergeAudioFilesRequestDto requestDto)
        {

            try
            {
                // Create a mixer object
                // This will be used for merging files together
                var mixer = new WaveMixerStream32
                {
                    AutoStop = true
                };

                foreach (var file in files)
                {
                    var builder = new Mp3FileReader.FrameDecompressorBuilder(wf => new Mp3FrameDecompressor(wf));
                    // TODO: figure out a way to decode mp3 on Mac (with Mac Os support codecs or something)
                    // https://www.markheath.net/post/managed-mp3-decoding-nlayer-naudio
                    // https://github.com/naudio/NAudio/issues/451
                    Mp3FileReaderBase reader = new Mp3FileReaderBase(file.OpenReadStream(), waveFormat => new Mp3FrameDecompressor(waveFormat));

                    var waveStream = WaveFormatConversionStream.CreatePcmStream(reader);
                    var channel = new WaveChannel32(waveStream)
                    {
                        //Set the volume
                        Volume = 0.5f
                    };

                    // add channel as an input stream to the mixer
                    mixer.AddInputStream(channel);
                }

                // convert wave stream from mixer to mp3
                using var output = new MemoryStream();
                var wave32 = new Wave32To16Stream(mixer);
                var mp3Writer = new LameMP3FileWriter(output, wave32.WaveFormat, 128);
                wave32.CopyTo(mp3Writer);

                // close all streams
                wave32.Close();
                mp3Writer.Close();

                

                var fileByteArray = output.ToArray();
                var fileName = requestDto.OutputFileName != null ? requestDto.OutputFileName : requestDto.JobId.ToString();
                return new AudioFileResult()
                {
                    Name = fileName + ".mp3",
                    ByteArray = fileByteArray
                };
            }
            catch (Exception e)
            {
                throw new Exception("Cannot merge mp3 files. Error: " + e);

            }

        }
    }
}

