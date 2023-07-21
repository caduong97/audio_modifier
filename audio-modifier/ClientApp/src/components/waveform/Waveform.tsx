import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';
import { PlayCircleFill, PauseCircleFill } from 'react-bootstrap-icons';
import { Button } from 'reactstrap';


interface WaveformProps {
  url: string
}

const Waveform = ({ url }: WaveformProps) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef({
    isPlaying: () => false,
  }) as any;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current as any,
      // responsive: true,
      barWidth: 2,
      minPxPerSec: 0,
      height: "auto",
      cursorWidth: 0,
    });
    waveSurfer.load(url);
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
    });
    waveSurfer.on('seeking', (currentTime) => {
      // console.log("seeking", currentTime)
      // console.log(waveSurferRef.current.options)
    });
    waveSurfer.on('play', () => {
      setIsPlaying(true)
    });
    waveSurfer.on('pause', () => {
      setIsPlaying(false)
    });
    waveSurfer.on('finish', () => {
      setIsPlaying(false)
    });
    waveSurfer.on('drag', (relativeX) => {
    });
    waveSurfer.on('click', (relativeX) => {
    });
    return () => {
      waveSurfer.destroy();
    };
  }, [url]);

  const handlePlayPause = () => {
    waveSurferRef.current.playPause();
  }

  const handleZoomIn = () => {
    waveSurferRef.current.zoom(waveSurferRef.current.options.minPxPerSec += 20)
  }

  const handleZoomOut = () => {
    if (waveSurferRef.current.options.minPxPerSec >= 20) {
      waveSurferRef.current.zoom(waveSurferRef.current.options.minPxPerSec -= 20)
    }
  }

  

  return (
    <div 
      className='h-auto' 
      style={{
        width: "100%",
        overflowX: "auto",
        minHeight: '500px'
      }}>

      <div className='d-block border' style={{height: '300px', boxSizing: "border-box"}} ref={containerRef} />

      <div className='w-auto d-block mt-4'>
        <Button onClick={handleZoomIn}>zoom in</Button>
        <button
          className='p-0 bg-white'
          style={{
            width: '40px',
            height: '40px',
            border: 'none', 
          }}
          onClick={handlePlayPause}
          type="button"
        >
          {isPlaying ? <PauseCircleFill size="30" /> : <PlayCircleFill size="30" />}
        </button>
        <Button onClick={handleZoomOut}>zoom out</Button>
      </div>

      

    </div>
  );
};

Waveform.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Waveform;