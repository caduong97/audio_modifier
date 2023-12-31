﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using audio_modifier.DTOs;
using audio_modifier.Helpers;
using audio_modifier.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace audio_modifier.Controllers
{
    public class MergeController : BaseController
    {
        private readonly IMergeService _mergeService;

        public MergeController(ILogger<BaseController> logger, IConfiguration configuration, IMergeService mergeService) : base(logger, configuration)
        {
            _mergeService = mergeService;
        }


        [HttpPost]
        [RequestSizeLimit(536870912)]
        public async Task Index([FromForm] List<IFormFile> files, [FromQuery] MergeAudioFilesRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                throw new Exception("Merge request model is not valid");
            }

            var result = _mergeService.MergeAudioFiles(files, requestDto);
            //using var fileStream = new MemoryStream(result.ByteArray);
            //fileStream.Seek(0, SeekOrigin.Begin);

            await ResponseFileHelper.WriteFileToResponseBody(Response, result);
            
        }

    }
}

