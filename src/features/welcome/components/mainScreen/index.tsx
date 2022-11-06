import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@global/components/button';
import { LINKS } from '@global/constants';
import useFlags from '@global/hooks/useFlags';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { trackUserEvent } from '@global/utils/analytics';
import { LinkIcon } from '@images/icons/LinkIcon';

import {
  WelcomeModalButtonsBlock,
  WelcomeModalTitleBlock,
  WelcomeModalWrapper,
  WelcomeScreenMainWrapper
} from './mainScreen.styles';

export const MainScreen = () => {
  const navigate = useNavigate();
  const { address } = usePersonalInfo();
  const openLink = (link: string) => window.open(link, '_blank');
  const { isHarmonyChains, isMissionsAvailable } = useFlags();

  const chainKey = useMemo(() => {
    if (isHarmonyChains) return 'harmony';
    return 'polygon';
  }, [isHarmonyChains]);

  const onBuyPlotLClick = () => {
    trackUserEvent('Buy a plot clicked', { address });
    if (isHarmonyChains) openLink(LINKS.harmony.lands);
    else navigate('/lands');
  };

  return (
    <WelcomeScreenMainWrapper id="mainScreen">
      <WelcomeModalWrapper>
        <WelcomeModalTitleBlock>
          <p>Welcome to mars colony</p>
          <p>
            What is marscolony{' '}
            <LinkIcon
              onClick={() => {
                trackUserEvent('What is marscolony clicked', { address });
                openLink(LINKS[chainKey].colonyGuide);
              }}
            />
          </p>
        </WelcomeModalTitleBlock>
        <WelcomeModalButtonsBlock>
          <Button onClick={onBuyPlotLClick} text="BUY A PLOT" variant="ghost" />
          <Button
            disabled={!isMissionsAvailable}
            onClick={() => {
              trackUserEvent('Play mission clicked', { address });
              navigate('/play/0');
            }}
            text={isMissionsAvailable ? 'PLAY MISSION' : 'PLAY MISSION (Soon)'}
            variant="common"
            disabledText="PLAY MISSION (Soon)"
          />
        </WelcomeModalButtonsBlock>
      </WelcomeModalWrapper>
    </WelcomeScreenMainWrapper>
  );
};
