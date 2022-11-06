import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QuestsBackend from '@api/questsBackend';
import { GameSelectPopup } from '@components/../features/game/components/gameSelectPopup/gameSelectPopup';
import gameConfig from '@features/game/constants/sceneConfigs';
import { LandPlot } from '@features/lands/components/land/LandPlot';
import Button from '@global/components/button';
import { useBalance } from '@global/hooks/useBalance';
import { trackUserEvent } from '@global/utils/analytics';
import { RootState, store } from '@redux/store';
import {
  GamePageBackButton,
  GameRootWrapper,
  GameZoomWrapper
} from '@root/features/global/styles/app.styles';
import { NavbarBackButton } from '@root/legacy/navbar.styles';
import { setLandMissionsAvailability } from '@slices/appPartsSlice';
import mixpanel from 'mixpanel-browser';
import { Game } from 'phaser';

const GamePage = () => {
  const landId = new URLSearchParams(window.location?.search).get('id') ?? '';

  const navigate = useNavigate();
  const { tokens, clnyBalance } = useBalance();
  const [missionPageState, setMissionsPageState] = useState({
    currentConfig: gameConfig,
    landMissions: null
  });

  const getLandMissions = async (landId: string) => {
    try {
      const response = await QuestsBackend.getLimits({
        landIds: [landId],
        avatarIds: []
      });

      setMissionsPageState({
        currentConfig: missionPageState.currentConfig,
        landMissions: response?.lands?.[landId]
      });

      store.dispatch(setLandMissionsAvailability(response?.lands?.[landId]));
    } catch (e) {}
  };

  useEffect(() => {
    getLandMissions(landId).then();
    mixpanel.track('Page visited', { pageName: 'Game Page' });
    mixpanel.track('My land visited', { landId });
    if (window.location.pathname.includes('/game')) {
      window.game = new Game(gameConfig);
      window.onresize = () => window.sizeChanged();
      // Resize changer for game viewport
      window.sizeChanged = () => {
        if (window?.game?.isBooted) {
          setTimeout(() => {
            window?.game?.scale.resize(window.innerWidth, window.innerHeight);
            window?.game?.canvas.setAttribute(
              'style',
              `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
            );
          }, 100);
        }
      };
    }

    return () => {
      window?.game?.destroy(true);
      window.sizeChanged = () => {};
      window.game = null;
      store.dispatch(setLandMissionsAvailability(null));
    };
  }, []);

  useEffect(() => {
    if (tokens) {
      if (!tokens.includes(landId)) {
        window.open(`${window.location.origin}`, '_self');
      }
    }
  }, [tokens]);

  return (
    <GameRootWrapper id="game-root">
      <GamePageBackButton>
        <Button
          onClick={() => {
            trackUserEvent('Go back clicked');
            navigate(-1);
          }}
          text="GO BACK"
          variant="common"
        />
      </GamePageBackButton>
      <GameZoomWrapper>
        <NavbarBackButton onClick={(e) => window?.onZoomIn(e)}>
          +
        </NavbarBackButton>
        <NavbarBackButton onClick={(e) => window?.onZoomOut(e)}>
          -
        </NavbarBackButton>
      </GameZoomWrapper>
      <GameSelectPopup />
      <LandPlot
        isCartItem={false}
        id={parseInt(landId)}
        CLNYBalance={clnyBalance}
        trigger={false}
      />
    </GameRootWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  tokens: state.balanceStats.tokens
});

export default connect(mapStateToProps)(GamePage);
