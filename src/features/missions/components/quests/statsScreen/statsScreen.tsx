import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import QuestsBackend from '@api/questsBackend';
import { SUBSCREEN_STEPS } from '@features/missions/constants';
import useQuests from '@features/missions/hooks/useQuests';
import { timeToLandMissionsLimitsReset } from '@features/missions/utils/questTimeRefetcher';
import { useRevshare } from '@features/revshare/hooks/useRevshare';
import useTimer from '@global/hooks/useTimer';
import { NETWORK_DATA } from '@root/settings';
import { missionRewardsSelector } from '@selectors/questsSelectors';
import mixpanel from 'mixpanel-browser';

import { QuestAdditionalText } from '../questAdditionalText/questAdditionalText';
import { RewardButton, StatsScreenWrapper } from '../questsScreen.styles';
import { QuestsTitle } from '../title/questsTitle';

export const StatsScreen = () => {
  const params = useParams();
  const [tries, setTries] = useState('...');
  const { subScreenStep } = useQuests();
  const { getRevshareByLandId, missionLandRevshare, setLandsRevshares } =
    useRevshare();
  const { id = '' } = useParams();
  const rewards = useSelector(missionRewardsSelector) ?? [];
  const { id: landId = '' } = params;
  const { hours, seconds, minutes } = timeToLandMissionsLimitsReset(
    parseInt(id)
  );
  const timer = useTimer({
    initialHours: hours,
    initialMinute: minutes,
    initialSeconds: seconds,
    isStarted: true,
    withHours: true,
    isRepetative: true
  });

  const statsRefetcher = async () => {
    const response = await QuestsBackend.getLimits({
      landIds: [landId],
      avatarIds: []
    });
    const limit = response.lands?.[landId];
    setTries(limit.limits + limit.limits2);
  };

  useEffect(() => {
    let interval: any;
    mixpanel.track('Stats screen initialized', { landId: id });

    if (landId && NETWORK_DATA.REVSHARE) getRevshareByLandId([landId]);

    (async () => await statsRefetcher())();
    (async () => {
      if (landId) {
        interval = setInterval(async () => {
          await statsRefetcher();
        }, 5000);
      }
    })();

    return () => {
      clearInterval(interval);
      setLandsRevshares([]);
    };
  }, [params, landId]);

  const text = (
    <p>
      Missions will refresh
      <br />
      in {timer}
    </p>
  );

  const title = (
    <>
      <span>{`Available missions: ${tries}`}</span>
      <br />
      {NETWORK_DATA.REVSHARE && (
        <span>{`Revshare: ${missionLandRevshare?.[0] ?? '...'}${
          missionLandRevshare?.[0] ? '%' : ''
        }`}</span>
      )}
    </>
  );

  const contentToRender = useMemo(() => {
    switch (subScreenStep) {
      case SUBSCREEN_STEPS.preparing:
        mixpanel.track('Stats screen preparing phase', { landId: id });
        return (
          <>
            <QuestsTitle
              text={title}
              additionalStyles={{ position: 'relative', top: '-6px' }}
            />
            <QuestAdditionalText text={text} />
          </>
        );
      case SUBSCREEN_STEPS.success:
        mixpanel.track('Stats screen success phase', { landId: id });
        return (
          <>
            <QuestsTitle
              text={title}
              additionalStyles={{ position: 'relative', top: '-6px' }}
            />
            <div className="mt-20">
              <QuestsTitle text="Rewards" bgColor="#34FF61" textColor="black" />
            </div>
            <QuestAdditionalText
              text={
                <>
                  <div>
                    {rewards.map(({ name, value, type }) => {
                      if (type === 'basic') {
                        return <p>{`+ ${name} - ${value}`}</p>;
                      }

                      if (type === 'accent') {
                        return (
                          <div className="mt-20">
                            <RewardButton>{`+ ${name}`}</RewardButton>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </>
              }
            />
          </>
        );
      case SUBSCREEN_STEPS.restart:
        mixpanel.track('Stats screen restart phase', { landId: id });
        return (
          <>
            <QuestsTitle
              text={title}
              additionalStyles={{ position: 'relative', top: '-6px' }}
            />
            <div style={{ marginTop: '15px' }}>
              <QuestAdditionalText text={text} />
            </div>
          </>
        );
    }
  }, [tries, rewards, subScreenStep, missionLandRevshare]);

  return <StatsScreenWrapper>{contentToRender}</StatsScreenWrapper>;
};
