import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAvatarsMeta from '@avatars/hooks/useAvatarsMeta';
import useFlags from '@global/hooks/useFlags';
import { currentLevelFromXp } from '@global/utils/xpToLevel';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsExpSelector,
  avatarsNamesSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import {
  closeAvatarPopup,
  setFirstVisitFlow,
  setSelectedAvatar
} from '@slices/avatarsSlice';

import {
  AvatarBlock,
  AvatarLvlXp,
  AvatarMintButton,
  AvatarsUIMintText,
  CompactAvatarUIWrapper,
  NameCompactText,
  NameSpecialityBlock,
  ShadowDropAvatar,
  Speciality
} from './avatarsPopup.styles';

type UserAvatarUIProps = { isQuestsView?: boolean };

export const AvatarUI = ({ isQuestsView }: UserAvatarUIProps) => {
  const dispatch = useDispatch();
  const { isAvatarsMintingAvailable } = useFlags();

  let selectAvatarParams;
  const userAvatars = useSelector(userAvatarsSelector);
  const avatarNames = useSelector(avatarsNamesSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const exp = useSelector(avatarsExpSelector);

  if (selectedAvatar?.length === 0) {
    selectAvatarParams = undefined;
  } else {
    selectAvatarParams = `${NETWORK_DATA.AVATAR_META}${selectedAvatar}`;
  }

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

  const onMarketNavigation = () => {
    if (!isAvatarsMintingAvailable) {
      dispatch(closeAvatarPopup());
      return window.open(
        'https://nftkey.app/collections/martiancolonists/',
        '_blank'
      );
    }
    dispatch(setFirstVisitFlow(true));
  };

  const nameIdx = userAvatars?.findIndex((item) => item === avatarToDisplay);
  const name = avatarNames?.[nameIdx ?? 0];

  const expValue = exp?.[avatarToDisplay] ?? '100';

  const getCorrectButtonText = () => {
    if (isAvatarsMintingAvailable) return 'MINT AN AVATAR';
    return 'BUY AN AVATAR';
  };

  if (!!avatarToDisplay)
    return (
      <AvatarBlock
        src={`${NETWORK_DATA.AVATAR_META}${parseInt(avatarToDisplay)}.jpg`}
      >
        <NameSpecialityBlock>
          <NameCompactText>
            {name?.length ? name : `No Name #${avatarToDisplay}`}
          </NameCompactText>
          <Speciality>{speciality ?? ''}</Speciality>
          <AvatarLvlXp>
            {`LVL ${currentLevelFromXp(expValue)} | XP ${expValue}` ?? (
              <>&nbsp;</>
            )}
          </AvatarLvlXp>
        </NameSpecialityBlock>
      </AvatarBlock>
    );

  return !avatarToDisplay ? (
    <CompactAvatarUIWrapper
      isQuestsView={isQuestsView}
      src={`../avatars/avatarPlaceholder.png`}
      onClick={onMarketNavigation}
      backgroundSize={'cover'}
    >
      <ShadowDropAvatar />
      <AvatarsUIMintText>
        You DO NOT HAVE any avatars to play mission
      </AvatarsUIMintText>
      <AvatarMintButton>{getCorrectButtonText()}</AvatarMintButton>
    </CompactAvatarUIWrapper>
  ) : null;
};
