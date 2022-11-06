import { CSSProperties, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAvatarsMeta from '@avatars/hooks/useAvatarsMeta';
import useRoutes from '@features/global/hooks/useRoutes';
import useFlags from '@global/hooks/useFlags';
import { currentLevelFromXp } from '@global/utils/xpToLevel';
import { TentIcon } from '@images/icons/TentIcon';
import { AvatarBorder } from '@root/images/icons/AvatarBorder';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsExpSelector,
  avatarsNamesSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import { avatarsMissionsLimitsSelector } from '@selectors/userStatsSelectors';
import {
  closeAvatarPopup,
  setFirstVisitFlow,
  setSelectedAvatar
} from '@slices/avatarsSlice';

import {
  AvatarSpeciality,
  AvatarStatsTopPanel
} from '../avatarCard/avatarCard.styles';
import { AvatarMintButton } from '../avatarUi/avatarsPopup.styles';

import {
  AvatarsUIMintText,
  CompactAvatarUIWrapper,
  NameCompactText,
  ShadowDropAvatar
} from './avatarsPopup.styles';

type UserAvatarUIProps = { isQuestsView?: boolean };

export const UserAvatarUI = ({ isQuestsView }: UserAvatarUIProps) => {
  const dispatch = useDispatch();
  const { isAvatarsMintingAvailable } = useFlags();

  const userAvatars = useSelector(userAvatarsSelector);
  const avatarNames = useSelector(avatarsNamesSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const avatarsLimits = useSelector(avatarsMissionsLimitsSelector);
  const exp = useSelector(avatarsExpSelector);
  let selectAvatarParams;

  if (selectedAvatar === '') {
    selectAvatarParams = undefined;
  } else {
    selectAvatarParams = `${NETWORK_DATA.AVATAR_META}${selectedAvatar}`;
  }

  const { isMissionsPage, isGamePage } = useRoutes();
  const { speciality } = useAvatarsMeta(selectAvatarParams);

  const avatarToDisplay = useMemo(() => {
    if (selectedAvatar && userAvatars?.includes(selectedAvatar))
      return selectedAvatar;
    if (userAvatars?.length) {
      localStorage.setItem(
        'selectedAvatar',
        userAvatars[userAvatars.length - 1]
      );
      dispatch(setSelectedAvatar(userAvatars[userAvatars.length - 1]));
      return userAvatars[userAvatars.length - 1];
    }
    return '';
  }, [selectedAvatar, userAvatars, dispatch]);

  const nameIdx = userAvatars?.findIndex((item) => item === avatarToDisplay);
  const name = avatarNames?.[nameIdx ?? 0];

  const specialityModification: CSSProperties = {
    bottom: '-35px',
    left: '5px',
    position: 'absolute',
    whiteSpace: 'nowrap',
    margin: '0'
  };

  const onMarketNavigation = () => {
    if (isAvatarsMintingAvailable) {
      dispatch(setFirstVisitFlow(true));
      return;
    }
    dispatch(closeAvatarPopup());
    window.open('https://nftkey.app/collections/martiancolonists/', '_blank');
    return true;
  };

  const availableMissions = avatarsLimits?.[avatarToDisplay] ?? '...';
  const expValue = exp?.[avatarToDisplay] ?? '100';

  if (!!avatarToDisplay)
    return (
      <CompactAvatarUIWrapper
        isQuestsView={isQuestsView}
        isGamePage={isGamePage}
        src={`${NETWORK_DATA.AVATAR_META}${parseInt(avatarToDisplay)}.jpg`}
      >
        {isGamePage && <AvatarBorder />}
        <AvatarStatsTopPanel isMissionsPage={isMissionsPage}>
          <div>
            <TentIcon />
            <span>
              {availableMissions}{' '}
              {availableMissions === 1 ? 'mission' : 'missions'}
            </span>
          </div>
        </AvatarStatsTopPanel>
        <>
          <NameCompactText>
            {name?.length ? name : `No Name #${avatarToDisplay}`}
          </NameCompactText>

          <AvatarSpeciality style={specialityModification}>
            {`${speciality ?? ''} LVL ${currentLevelFromXp(
              expValue
            )} | XP ${expValue}` ?? <>&nbsp;</>}
          </AvatarSpeciality>
        </>
      </CompactAvatarUIWrapper>
    );

  return !avatarToDisplay ? (
    <CompactAvatarUIWrapper
      isQuestsView={isQuestsView}
      src={`../avatars/avatarPlaceholder.png`}
      onClick={onMarketNavigation}
      backgroundSize={'cover'}
    >
      <ShadowDropAvatar />
      <AvatarsUIMintText>You need an avatar to play missions</AvatarsUIMintText>
      <AvatarMintButton mt="41px">BUY AN AVATAR</AvatarMintButton>
    </CompactAvatarUIWrapper>
  ) : null;
};
