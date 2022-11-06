import React, { useEffect, useState } from 'react';
import { MainScreen } from '@features/welcome/components/mainScreen';
import { PolygonScreen } from '@features/welcome/components/polygon_planet_statistic/PolygonScreen';
import {
  HookLink,
  Line,
  PageScreenPagination
} from '@features/welcome/components/screen.styles';
import { NETWORK_DATA } from '@root/settings';

const WelcomePage = () => {
  const [active, setActive] = useState<number>(0);
  const polygonBanner = NETWORK_DATA.STATS_HEADER;

  const handleScroll = () => {
    if (window.scrollY > document.documentElement.clientHeight - 1) {
      setActive(1);
    } else if (window.scrollY === 0) {
      setActive(0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <MainScreen />
      {polygonBanner ? (
        <>
          <PolygonScreen />
          <PageScreenPagination>
            <HookLink
              href="#mainScreen"
              flag={active === 0}
              onClick={() => setActive(0)}
            >
              01
            </HookLink>
            <Line />
            <HookLink
              href="#polygonStatisticScreen"
              flag={active === 1}
              onClick={() => setActive(1)}
            >
              02
            </HookLink>
          </PageScreenPagination>
        </>
      ) : null}
    </>
  );
};

export default WelcomePage;
