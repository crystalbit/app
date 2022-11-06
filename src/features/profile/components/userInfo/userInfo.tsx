import React, { useEffect, useMemo, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { copyTextToClipboard } from '@features/globus/utils/methods';
import { UserModal } from '@features/profile/components/userModal/userModal';
import { CHAIN_TABS, USER_TABS } from '@features/profile/constants';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { generateBlockie } from '@global/utils/blockie.canvas';
import { CommonAvatarsProfile } from '@images/icons/CommonAvatarsProfile';
import { Discord } from '@images/icons/Discord';
import { EditIcon } from '@images/icons/EditIcon';
import { Twitter } from '@images/icons/Twitter';
import OneIconImg from '@images/photo/connection-zone-icons/OneIcon.png';
import PolygonIconImg from '@images/photo/connection-zone-icons/PolygonIcon.png';
import { LandPinIcon } from '@root/images/icons/LandPinIcon';
import { contracts, NETWORK_DATA } from '@root/settings';

import {
  BlockLandNameIcon,
  ChainLandBlock,
  ChainTabHead,
  ChainTabHeadText,
  CircleSocialIcon,
  InfoBlock,
  InfoWrapper,
  LandImg,
  LandName,
  Name,
  StatisticAvatars,
  StatisticBlock,
  StatisticBlockLandsAvatar,
  StatisticCounter,
  StatisticLands,
  TabsBlock,
  TabsText,
  UserBlock,
  UserBlockImgName,
  UserImage,
  UserName,
  UserSocialBlock,
  UserTabHead
} from './userInfo.styles';

export const UserInfo = () => {
  const { addToast } = useToasts();
  const { address } = usePersonalInfo();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [chainTab, setChainTab] = useState(['Harmony', 0]);
  const [name, setName] = useState<string>('...');
  const [twitterName, setTwitterName] = useState<string>('');
  const [discordName, setDiscordName] = useState<string>('');
  const [active, setActive] = useState<boolean>(false);
  const [countAvatars, setCountAvatars] = useState([0, 0]);
  const [countLands, setCountLands] = useState([0, 0]);
  const [landsData, setLandsData] = useState([[], []]);
  const [avatarsData, setAvatarsData] = useState([[], []]);

  const activeTabColor = (idx: number) =>
    currentTab === idx ? '#00E979' : 'rgba(255, 255, 255, 0.5)';

  const tabsBar = useMemo(() => {
    return USER_TABS.map(({ label }, idx) => (
      <UserTabHead
        key={label}
        flag={currentTab === idx}
        active={activeTabColor(idx)}
        onClick={() => {
          setCurrentTab(idx);
        }}
        index={idx}
      >
        <TabsText>{label}</TabsText>
      </UserTabHead>
    ));
  }, [currentTab]);

  const chainsTabStatisticLand = useMemo(() => {
    return CHAIN_TABS.map(({ label }, idx) => (
      <ChainTabHead
        key={label}
        onClick={() => {
          setChainTab([label, idx]);
        }}
      >
        <ChainTabHeadText flag={chainTab[1] === idx}>
          {idx === 0 ? (
            <img src={OneIconImg} alt="" width={16} />
          ) : (
            <img src={PolygonIconImg} alt="" width={16} />
          )}
          {label + ': ' + countLands[idx]}
        </ChainTabHeadText>
      </ChainTabHead>
    ));
  }, [chainTab, countLands]);

  const chainsTabStatisticAvatar = useMemo(() => {
    return CHAIN_TABS.map(({ label }, idx) => (
      <ChainTabHead
        key={label}
        onClick={() => {
          setChainTab([label, idx]);
        }}
      >
        <ChainTabHeadText flag={chainTab[1] === idx}>
          {idx === 0 ? (
            <img src={OneIconImg} alt="Harmony" width={16} />
          ) : (
            <img src={PolygonIconImg} alt="Polygon" width={16} />
          )}
          {label + ': ' + countAvatars[idx]}
        </ChainTabHeadText>
      </ChainTabHead>
    ));
  }, [chainTab, countAvatars]);

  const tabContent = useMemo(() => {
    switch (currentTab) {
      case 0:
        return (
          <StatisticBlockLandsAvatar>
            <StatisticCounter>{chainsTabStatisticLand}</StatisticCounter>
            <ChainLandBlock>
              {chainTab[1] === 0
                ? landsData[0].map((item: any) => (
                    <StatisticLands key={item.id}>
                      <div>
                        <LandImg
                          url={generateBlockie(item.id, 'harmony').toDataURL()}
                        />
                      </div>
                      <BlockLandNameIcon>
                        <LandName>Land #{item.id}</LandName>
                        <LandPinIcon fill={'#fff'} stroke={'#fff'} />
                      </BlockLandNameIcon>
                    </StatisticLands>
                  ))
                : landsData[1].map((item: any) => (
                    <StatisticLands key={item.id}>
                      <div>
                        <LandImg
                          url={generateBlockie(item.id, 'polygon').toDataURL()}
                        />
                      </div>
                      <BlockLandNameIcon>
                        <LandName>Land #{item.id}</LandName>
                        <LandPinIcon fill={'#fff'} stroke={'#fff'} />
                      </BlockLandNameIcon>
                    </StatisticLands>
                  ))}
            </ChainLandBlock>
          </StatisticBlockLandsAvatar>
        );
      case 1:
        return (
          <StatisticBlockLandsAvatar>
            <StatisticCounter>{chainsTabStatisticAvatar}</StatisticCounter>
            <ChainLandBlock>
              {chainTab[1] === 0
                ? avatarsData[0].map((item: any) => (
                    <StatisticAvatars key={item.id}>
                      <div>
                        <LandImg
                          url={`https://meta-avatar.marscolony.io/${parseInt(
                            item.id
                          )}.jpg`}
                        />
                      </div>
                      <div>
                        <LandName>
                          {item.name === '' ? `No name# ${item.id}` : item.name}
                        </LandName>
                      </div>
                    </StatisticAvatars>
                  ))
                : avatarsData[1].map((item: any) => (
                    <StatisticAvatars key={item.id}>
                      <div>
                        <LandImg
                          url={`https://meta-avatar-polygon.marscolony.io/${parseInt(
                            item.id
                          )}.jpg`}
                        />
                      </div>
                      <div>
                        <LandName>
                          {item.name === '' ? `No name# ${item.id}` : item.name}
                        </LandName>
                      </div>
                    </StatisticAvatars>
                  ))}
            </ChainLandBlock>
          </StatisticBlockLandsAvatar>
        );
      default:
        return null;
    }
  }, [currentTab, chainTab, address, landsData, avatarsData]);

  const onSocialNavigation = () => {
    if (twitterName.length > 0) {
      window.open(`https://twitter.com/${twitterName}`, '_blank');
    }
    return true;
  };

  useEffect(() => {
    fetch(`${NETWORK_DATA.BACKEND}/profile/profile?address=${address}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.name === '') {
          setName(address.slice(0, 8));
          setTwitterName('');
          setDiscordName('');
        } else {
          setName(data.name);
          setTwitterName(data.twitter);
          setDiscordName(data.discord);
        }
      });

    fetch(`${contracts.harmony.BACKEND}/profile/lands?address=${address}`)
      .then((response) => response.json())
      .then((data) => {
        let counterHarmony: number = 0;
        let counterPolygon: number = 0;
        let HarmonyArr: any = [];
        let polygonArr: any = [];
        data.lands.forEach((item: any) => {
          if (item.network === 'harmony' || item.network === 'harmain') {
            HarmonyArr.push(item);
            counterHarmony++;
          } else if (item.network === 'polygon') {
            polygonArr.push(item);
            counterPolygon++;
          }
        });
        setLandsData([HarmonyArr, polygonArr]);
        setCountLands([counterHarmony, counterPolygon]);
      });

    fetch(`${contracts.harmony.BACKEND}/profile/avatars?address=${address}`)
      .then((response) => response.json())
      .then((data) => {
        let counterHarmony = 0;
        let counterPolygon = 0;
        let HarmonyArr: any = [];
        let polygonArr: any = [];
        data.avatars.forEach((item: any) => {
          if (item.network === 'harmony' || item.network === 'harmain') {
            HarmonyArr.push(item);
            counterHarmony++;
          } else if (item.network === 'polygon') {
            polygonArr.push(item);
            counterPolygon++;
          }
        });

        setAvatarsData([HarmonyArr, polygonArr]);
        setCountAvatars([counterHarmony, counterPolygon]);
      });
  }, [address, active]);

  return (
    <>
      <InfoWrapper>
        <InfoBlock>
          <UserBlock>
            <UserBlockImgName>
              <UserImage>
                <CommonAvatarsProfile />
              </UserImage>
              <UserName>
                <Name>{name}</Name>
                <EditIcon onClick={() => setActive(!active)} />
              </UserName>
            </UserBlockImgName>
            <UserSocialBlock>
              <CircleSocialIcon>
                <Discord
                  fill={discordName.length > 0 ? '#fff' : '#ffffff33'}
                  flag={discordName.length > 0}
                  onClick={() => {
                    if (discordName.length > 0) {
                      copyTextToClipboard(discordName).then(() => {
                        addToast('Discord user id copied!', {
                          appearance: 'success'
                        });
                      });
                    }
                  }}
                />
              </CircleSocialIcon>
              <CircleSocialIcon>
                <Twitter
                  fill={twitterName.length > 0 ? '#fff' : '#ffffff33'}
                  onClick={() => onSocialNavigation()}
                  flag={twitterName.length > 0}
                />
              </CircleSocialIcon>
            </UserSocialBlock>
          </UserBlock>
        </InfoBlock>
        <TabsBlock>{tabsBar}</TabsBlock>
        <StatisticBlock>{tabContent}</StatisticBlock>
        {active && (
          <UserModal
            name={name}
            active={active}
            setActive={setActive}
            twitterName={twitterName}
            discordName={discordName}
          />
        )}
      </InfoWrapper>
    </>
  );
};
