import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MissionList } from '@features/play/component/mission/missionList';
import { MISSIONS_BLOCK_TABS, MISSIONS_LIST } from '@features/play/constants';
import useMining from '@features/play/hooks/useMining';
import useAppParts from '@global/hooks/useAppParts';
import { TOXIC_GREEN, WHITE } from '@global/styles/variables';
import { trackUserEvent } from '@global/utils/analytics';
import { AvatarsList } from '@root/features/play/component/avatars/avatarList/AvatarsList';
import { CryoChamber } from '@root/features/play/component/cryochamber/CryoChamber';
import Storage from '@root/features/play/component/storage/Storage';

import {
  TabHead,
  TabList,
  TabsBlock,
  TabsWrapper
} from './playScreenTabs.styles';

const PlayScreenTabs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isGearModalOpened } = useAppParts();
  const { isMiningPrepareScreen: isHeaderHidden } = useMining();

  const [currentTab, setCurrentTab] = useState<number>(
    MISSIONS_BLOCK_TABS.findIndex((i) => i.isActive)
  );

  useEffect(() => {
    if (id !== undefined) {
      if (MISSIONS_BLOCK_TABS[parseInt(id)]?.isActive) {
        setCurrentTab(Number(id));
        return;
      }
    }
  }, [id]);

  const activeTabColor = (idx: number) =>
    currentTab === idx ? TOXIC_GREEN : WHITE;

  const tabsBar = useMemo(() => {
    return MISSIONS_BLOCK_TABS.map(({ label, isActive }, idx) => (
      <TabHead
        isActive={isActive}
        key={label}
        flag={currentTab === idx}
        active={activeTabColor(idx)}
        onClick={() => {
          trackUserEvent(`${label} submenu clicked`);
          if (!isActive) return;
          setCurrentTab(idx);
          navigate('/play/0');
        }}
      >
        {label}
      </TabHead>
    ));
  }, [currentTab]);

  const tabContent = useMemo(() => {
    switch (currentTab) {
      case 0:
        return <MissionList items={MISSIONS_LIST} />;
      case 1:
        return <AvatarsList />;
      case 2:
        return <CryoChamber />;
      case 3:
        return <Storage />;
      default:
        return null;
    }
  }, [currentTab]);

  const header = useMemo(() => {
    if (isHeaderHidden) return null;
    return (
      <TabsWrapper>
        <TabList>{tabsBar}</TabList>
      </TabsWrapper>
    );
  }, [isHeaderHidden, tabContent]);

  return (
    <TabsBlock flag={currentTab === 0 || isGearModalOpened}>
      {header}
      {tabContent}
    </TabsBlock>
  );
};

export { PlayScreenTabs };
