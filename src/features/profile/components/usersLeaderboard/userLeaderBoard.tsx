import React, { useMemo, useState } from 'react';
import {
  AttributesTabHead,
  AttributesText,
  LeaderBoardBlock,
  LeaderBoardWrapper,
  MainTabHeadText,
  Option,
  Select,
  TabsAvatarsUsers,
  TabsAvatarsUsersBlock,
  TabsBlock,
  TextTitle,
  TitleBlock,
  UserBlockInfo,
  UserLeaderBlockNameProfession,
  UserMarks,
  UserRatingName,
  UserRatingProfession,
  UsersContent,
  UsersListBlock,
  UserTabsParams,
  UserTitle
} from '@features/profile/components/usersLeaderboard/userLeaderBoard.styles';
import {
  LB_AVATARS_ATTRIBUTES,
  LB_USERS_ATTRIBUTES,
  LEADERBOARD,
  ONE_TIME_LINE,
  TIME_LINE
} from '@features/profile/constants';
import useMediaQuery from '@global/hooks/useMediaQuery';
import { StarIcon } from '@images/icons/StarIcon';

export const LeaderBoard = () => {
  const [currentAvatarsTab, setCurrentAvatarsTab] = useState(['LVL', 0]);
  const [currentUsersTab, setCurrentUsersTab] = useState(['CLNY Burned', 0]);
  const [currentMainTab, setCurrentMainTab] = useState(['Avatars', 0]);
  const isMobile = useMediaQuery(`(max-width: 450px)`);

  const avatarsTabsBar = useMemo(() => {
    return LB_AVATARS_ATTRIBUTES.map(({ label }, idx) => (
      <AttributesTabHead
        key={label}
        onClick={() => {
          setCurrentAvatarsTab([label, idx]);
        }}
      >
        <AttributesText flag={currentAvatarsTab[1] === idx}>
          {label}
        </AttributesText>
      </AttributesTabHead>
    ));
  }, [currentAvatarsTab]);

  const usersTabsBar = useMemo(() => {
    return LB_USERS_ATTRIBUTES.map(({ label }, idx) => (
      <AttributesTabHead
        key={label}
        onClick={() => {
          setCurrentUsersTab([label, idx]);
        }}
      >
        <AttributesText flag={currentUsersTab[1] === idx}>
          {label}
        </AttributesText>
      </AttributesTabHead>
    ));
  }, [currentUsersTab]);

  const mainTabsBar = useMemo(() => {
    return LEADERBOARD.map(({ label }, idx) => (
      <div
        key={label}
        onClick={() => {
          setCurrentMainTab([label, idx]);
        }}
      >
        <MainTabHeadText flag={currentMainTab[1] === idx}>
          {label}
        </MainTabHeadText>
      </div>
    ));
  }, [currentMainTab]);

  return (
    <LeaderBoardWrapper>
      <LeaderBoardBlock>
        <TabsAvatarsUsersBlock>
          <TabsAvatarsUsers>{mainTabsBar}</TabsAvatarsUsers>

          <Select>
            {currentMainTab[1] === 0 && currentAvatarsTab[0] === 'LVL'
              ? ONE_TIME_LINE.map((item) => {
                  return <Option value={item.label}>{item.label}</Option>;
                })
              : TIME_LINE.map((item) => {
                  return <Option value={item.label}>{item.label}</Option>;
                })}
          </Select>
        </TabsAvatarsUsersBlock>

        <TitleBlock>
          <TextTitle>Leaderboard</TextTitle>
          {currentMainTab[0] === 'Avatars' ? (
            <TabsBlock>{avatarsTabsBar}</TabsBlock>
          ) : (
            <TabsBlock> {usersTabsBar}</TabsBlock>
          )}
        </TitleBlock>

        {currentMainTab[0] === 'Avatars' ? (
          <UsersListBlock>
            {Array(1000)
              .fill(1)
              .map((value, index) => {
                return (
                  <UsersContent>
                    <UserBlockInfo>
                      <UserRatingName>#{index + 1}</UserRatingName>
                      <UserTitle>
                        {isMobile ? (
                          <UserLeaderBlockNameProfession>
                            <UserRatingName>No name #21000 </UserRatingName>
                            <UserRatingProfession>
                              | Scientist
                            </UserRatingProfession>
                          </UserLeaderBlockNameProfession>
                        ) : (
                          <>
                            <UserRatingName>No name #21000 </UserRatingName>
                            <UserRatingProfession>
                              | Scientist
                            </UserRatingProfession>
                          </>
                        )}

                        <UserMarks>
                          <StarIcon />
                          Your avatar
                        </UserMarks>
                      </UserTitle>
                    </UserBlockInfo>

                    <div>
                      <UserTabsParams>45 {currentAvatarsTab[0]}</UserTabsParams>
                    </div>
                  </UsersContent>
                );
              })}
          </UsersListBlock>
        ) : (
          <UsersListBlock>
            {Array(1000)
              .fill(1)
              .map((value, index) => {
                return (
                  <UsersContent>
                    <UserBlockInfo>
                      <UserRatingName>#{index + 1}</UserRatingName>
                      <UserTitle>
                        <UserRatingName>0x6beC....24f0c9</UserRatingName>
                      </UserTitle>
                    </UserBlockInfo>

                    <div>
                      <UserTabsParams>200 {currentUsersTab[0]}</UserTabsParams>
                    </div>
                  </UsersContent>
                );
              })}
          </UsersListBlock>
        )}
      </LeaderBoardBlock>
    </LeaderBoardWrapper>
  );
};
