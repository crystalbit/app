import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MUSIC_INFO } from '@global/constants';
import { InfoComponent } from '@images/icons/InfoComponent';
import { MutedComponent } from '@images/icons/MutedComponent';
import { UnmutedComponent } from '@images/icons/UnmutedComponent';

import {
  AttrLink,
  AudioComponent,
  Content,
  Info,
  MusicalBlock,
  MusicIcon,
  MusicSlider,
  Text
} from './musicStyle.style';

export const Music: React.FC = () => {
  const value =
    localStorage.getItem('volume') !== null
      ? Number(localStorage.getItem('volume'))
      : 30;
  const [volume, setVolume] = useState<number>(value);
  const checkVol = useMemo(() => {
    return volume;
  }, []);
  const [show, setShow] = useState<boolean>(false);
  const [checkClickMusicIcon, setClickMusicIcon] = useState<boolean>(false);
  const [checkInpt, setCheckInpt] = useState<boolean>(false);

  let indx =
    localStorage.getItem('index') !== null
      ? Number(localStorage.getItem('index'))
      : 0;
  const [trackIndex, setTrackIndx] = useState<number>(indx);
  const volumeController = useRef(new Audio());

  const [path, setPath] = useState<string>('');
  const [page, setPage] = useState<string>('');

  useEffect(() => {
    const urlPaths = path.split('/');
    const timer = setInterval(() => {
      setPath(window.location.pathname);
      setPage(urlPaths[1]);
    }, 1000);
    return () => clearInterval(timer);
  }, [path]);

  const view = (
    <Content>
      <Text>
        {MUSIC_INFO[indx].trackName} |{' '}
        <AttrLink href={MUSIC_INFO[indx].trackLink}>
          {MUSIC_INFO[indx].trackLink}
        </AttrLink>
      </Text>
      <Text>
        Music promoted by{' '}
        <AttrLink href={MUSIC_INFO[indx].musicPromoted}>
          {MUSIC_INFO[indx].musicPromoted}
        </AttrLink>
      </Text>
      <Text>{MUSIC_INFO[indx].creativeAttribute}</Text>
      <AttrLink href={MUSIC_INFO[indx].creativeAttributeLink}>
        {MUSIC_INFO[indx].creativeAttributeLink}
      </AttrLink>
    </Content>
  );

  const playNextTrack = () => {
    if (indx === MUSIC_INFO.length - 1) {
      indx = 0;
      localStorage.setItem('index', indx.toString());
      setTrackIndx(indx);
    } else {
      indx++;
      localStorage.setItem('index', indx.toString());
      setTrackIndx(indx);
    }
  };

  useEffect(() => {
    const playMusic = () => {
      volumeController?.current?.play?.();
    };
    document.addEventListener('click', playMusic, { once: true });
  }, []);

  useEffect(() => {
    volumeController.current.volume = volume / 100;

    if (volume === 0) {
      volumeController.current.pause();
    } else {
      volumeController.current.play();
    }

    if (checkInpt) {
      const timer = setTimeout(() => {
        if (volume !== checkVol) {
          setShow((s) => !s);
        }
      }, 5000);
      return () => clearTimeout(timer);
    } else if (checkClickMusicIcon) {
      if (!checkInpt) {
        const checkTimer = setTimeout(() => {
          const timer = setTimeout(() => {
            if (volume === checkVol) {
              setShow((s) => !s);
            }
          }, 5000);
          return () => clearTimeout(timer);
        }, 2000);
        return () => clearTimeout(checkTimer);
      }
    }
  }, [volume, checkClickMusicIcon]);

  return (
    <>
      <MusicalBlock path={page}>
        <MusicIcon
          onClick={() => {
            setShow((visible) => !visible);
            setClickMusicIcon((click) => !click);
          }}
        >
          {volume === 0 ? <MutedComponent /> : <UnmutedComponent />}
        </MusicIcon>

        <Info>
          <InfoComponent />
        </Info>
        {view}

        <div style={{ position: 'relative' }}>
          {show && (
            <MusicSlider
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e: any) => {
                setVolume(e.target.valueAsNumber);
                volumeController.current.volume = e.target.valueAsNumber / 100;
                localStorage.setItem(
                  'volume',
                  e.target.valueAsNumber.toString()
                );
                setCheckInpt(true);
              }}
            />
          )}
        </div>
      </MusicalBlock>

      <AudioComponent
        autoPlay
        src={MUSIC_INFO[trackIndex].file_name}
        onEnded={() => playNextTrack()}
        ref={volumeController}
      />
    </>
  );
};
