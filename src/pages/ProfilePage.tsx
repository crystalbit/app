import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { UserInfo } from '@features/profile/components/userInfo/userInfo';
//import { LeaderBoard } from '@features/profile/components/usersLeaderboard/userLeaderBoard';
//import { PROFILE_TABS } from '@features/profile/constants';
import {
  //TabHead,
  // TabList,
  TabsBlock
  // TabsWrapper
} from '@features/profile/style/profileTabs.styles';
//import { TOXIC_GREEN, WHITE } from '@global/styles/variables';

export const ProfilePage = () => {
  // const navigate = useNavigate();
  // const [currentTab, setCurrentTab] = useState<number>(0);

  // const handler = (idx: number) => {
  //   navigate(`/profile/${idx}`);
  // };

  // const activeTabColor = (idx: number) =>
  //   currentTab === idx ? TOXIC_GREEN : WHITE;

  // const tabsBar = useMemo(() => {
  //   return PROFILE_TABS.map(({ label, isActive }, idx) => (
  //     <TabHead
  //       isActive={isActive}
  //       key={label}
  //       flag={currentTab === idx}
  //       active={activeTabColor(idx)}
  //       onClick={() => {
  //         if (!isActive) return;
  //         setCurrentTab(idx);
  //         handler(idx);
  //       }}
  //     >
  //       {isActive ? label : label.concat(' (soon)')}
  //     </TabHead>
  //   ));
  // }, [currentTab]);

  // const tabContent = useMemo(() => {
  //   switch (currentTab) {
  //     case 0:
  //       return <UserInfo />;
  //     case 1:
  //       return <LeaderBoard />;
  //     default:
  //       return null;
  //   }
  // }, [currentTab]);

  return (
    <TabsBlock>
      {/*<TabsWrapper>*/}
      {/*  <TabList>{tabsBar}</TabList>*/}
      {/*</TabsWrapper>*/}
      {/*{tabContent}*/}
      <UserInfo />
    </TabsBlock>
  );
};
