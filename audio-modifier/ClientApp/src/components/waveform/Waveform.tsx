import React, { useState, useEffect, useRef, ChangeEvent, memo } from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';
import { PlayCircleFill, PauseCircleFill } from 'react-bootstrap-icons';
import { Button } from 'reactstrap';
import Regions, { type RegionParams } from 'wavesurfer.js/dist/plugins/regions.js'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.js'
import SettingsDropdown from '../SettingsDropdown';
import SettingItem from '../SettingItem';
import TrimAudioRequest from '../../models/trim/TrimAudioRequest';


interface WaveformProps {
  url: string,
  trimMode?: boolean,
  updateTrimSettings?: (start: number, end: number) => void,
}

const Waveform = ({ 
  url,
  trimMode = false,
  updateTrimSettings,
}: WaveformProps) => {
  const waveFormContainerRef = useRef(null);
  const waveSurferRef = useRef({
    isPlaying: () => false,
  }) as any;
  const [isPlaying, setIsPlaying] = useState(false);
  const activeRegion = useRef<any>(null)

  // Region states
  const [{regionStart, regionEnd}, setRegionPositions] = useState<any>({regionStart: 0, regionEnd: 0})
  // Trim region ref, keeping track of the region props 
  const trimRegion = useRef<any>(null)
  const wsRegions = useRef<Regions | null>(null)

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveFormContainerRef.current as any,
      barWidth: 2,
      minPxPerSec: 0,
      height: "auto",
      cursorWidth: 0,
    });

    // Initialize the Timeline plugin
    waveSurfer.registerPlugin(Timeline.create())
    // Initialize the Region plugin
    wsRegions.current = waveSurfer.registerPlugin(Regions.create())
    

    waveSurfer.load(url);
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
    });
    waveSurfer.on('seeking', (currentTime) => {
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
    waveSurfer.on('interaction', () => {
      if (activeRegion.current !== null) {
        activeRegion.current.setOptions({ color: "rgba(110, 7, 194, 0.2)" })
        activeRegion.current = null
      }
      
    })
    waveSurfer.on('decode', (duration) => {
      if (trimMode) {
        initTrimRegion(duration)
      }
    });

    console.log(waveSurfer)
    
    return () => {
      setIsPlaying(false) 
      if (waveSurfer) {
        waveSurfer.destroy();
      }
    };
  }, [url, trimMode, regionStart, regionEnd]);


  const initTrimRegion = (fullAudioDuration: number) => {
    if (wsRegions.current) {
      const defaultRegionStart = regionStart !== 0
        ? regionStart
        : 0
      const defaultRegionEnd = regionEnd !== 0
        ? regionEnd
        : 4
      wsRegions.current.addRegion({
        id: "trim-region",
        start: defaultRegionStart,
        end: defaultRegionEnd,
        content: 'Resize or drag me',
        color: "rgba(110, 7, 194, 0.2)",
        drag: true,
        resize: true,
      })  
      // wsRegions.enableDragSelection({
      //   color: 'rgba(255, 0, 0, 0.1)',
      // })
      wsRegions.current.on("region-created", (region) => {
        setRegionPositions({start: defaultRegionStart, end: defaultRegionEnd})
      })
      wsRegions.current.on('region-updated', (region) => {     
        trimRegion.current = region 
      })
      wsRegions.current.on('region-clicked', (region, e) => {
        e.stopPropagation() 
        activeRegion.current = region
        activeRegion.current.play()
        activeRegion.current.setOptions({ color: "rgba(110, 7, 194, 0.5)" })
        setIsPlaying(true)
      })
      wsRegions.current.on('region-out', (region) => {
        if (activeRegion.current === region) {
          region.play()
        }
      })
    }
  }

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

  const handleTrim = () => {
    console.log("Handle trim")
    const { start, end } = trimRegion.current ?? {start:0, end:0}
    console.log("start", start, "end", end)

    setRegionPositions({regionStart: start, regionEnd: end})
    if (!updateTrimSettings) return
    updateTrimSettings(start, end)
  } 

  return (
    <div 
      className='h-auto' 
      style={{
        width: "100%",
        overflowX: "auto",
        minHeight: '500px'
      }}>

      <div className='d-block border' style={{height: '300px', boxSizing: "border-box"}} ref={waveFormContainerRef} />

      <div className='w-auto d-block mt-5'>
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

        {
          trimMode &&
          <div className='d-flex flex-column flex-sm-row justify-content-end mt-3'>
            <Button
              color='primary'
              className='ms-sm-3'
              onClick={handleTrim}
            >Trim</Button>
          </div>
         
        }
        
      
    </div>
  );
};

// Waveform.propTypes = {
//   url: PropTypes.string.isRequired,
// };

export default React.memo(Waveform);