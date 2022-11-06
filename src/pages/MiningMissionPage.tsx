import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import MiningQuestApi from '@api/miningQuestApi';
import QuestsBackend from '@api/questsBackend';
import { useAvatars } from '@avatars/hooks/useAvatars';
import { gameConfig, initGame } from '@features/play/game';
import { Loader } from '@global/components/loader/loader';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { extractURLParam } from '@global/utils/urlParams';
import { RootState } from '@redux/store';
import {
  GameRootLoaderWrapper,
  GameRootWrapper
} from '@root/features/global/styles/app.styles';
import { setMiningGameInfo } from '@slices/questSlice';
import { Game } from 'phaser';

const MiningMission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const location = useLocation();
  const { address } = usePersonalInfo();
  const { selectedAvatar: avatarId } = useAvatars();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname.includes('/mining')) {
      (async () => {
        const transportId = extractURLParam(location, 'transportId');
        if (!avatarId || !address.length || !transportId) return;

        const data = await QuestsBackend.getRandomLand({
          address,
          additionalMissionId: 2
        });

        if (!data.success) {
          addToast('Error. Try again later.', { appearance: 'error' });
          return navigate('/play/0');
        }

        const response = await MiningQuestApi.start({
          address,
          transportId,
          missionId: '2',
          avatarId,
          landId: data.landId,
          callback: () => {
            return navigate('/play/0');
          }
        });

        if (response) {
          setIsLoading(false);
          dispatch(setMiningGameInfo(response));
          // @ts-ignore
          let game = (window.game = new Game(gameConfig));
          initGame(game);
        }
      })();
    }

    return () => {
      MiningQuestApi.leaveMission()
        .then(() => {
          window.removeEventListener('resize', window.restartMiningGame);
          window?.game?.destroy(true);
          window.sizeChanged = () => {};
          window.game = null;
        })
        .catch(() => {
          window.removeEventListener('resize', window.restartMiningGame);
          window?.game?.destroy(true);
          window.sizeChanged = () => {};
          window.game = null;
        });
    };
  }, []);

  return (
    <>
      {isLoading && (
        <GameRootLoaderWrapper>
          <Loader />
        </GameRootLoaderWrapper>
      )}
      <GameRootWrapper id="phaser3-webpack" />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  tokens: state.balanceStats.tokens
});

export default connect(mapStateToProps)(MiningMission);
