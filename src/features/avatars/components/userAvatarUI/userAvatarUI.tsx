import { CSSProperties, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useAvatarsMeta from '@avatars/hooks/useAvatarsMeta';
import { currentLevelFromXp } from '@global/utils/xpToLevel';
import { AvatarUiPlay } from '@images/icons/AvatarUIPlay';
import { TentIcon } from '@images/icons/TentIcon';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsExpSelector,
  avatarsNamesSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import { avatarsMissionsLimitsSelector } from '@selectors/userStatsSelectors';
import { toggleMyLandPopup } from '@slices/appPartsSlice';
import {
  setAvatarEdit,
  setFirstVisitFlow,
  setSelectedAvatar,
  switchAvatarsSelectMode
} from '@slices/avatarsSlice';

import {
  AvatarSpeciality,
  AvatarStatsTopPanel
} from '../avatarCard/avatarCard.styles';
import {
  AvatarsUIMintText,
  CompactAvatarUIWrapper,
  NameAvatarButton,
  NameCompactText,
  Rename,
  ShadowDropAvatar
} from '../avatarsPopup/avatarsPopup.styles';

type UserAvatarUIProps = { isQuestsView?: boolean };

export const UserAvatarUI = ({ isQuestsView }: UserAvatarUIProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userAvatars = useSelector(userAvatarsSelector);
  const avatarNames = useSelector(avatarsNamesSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const avatarsLimits = useSelector(avatarsMissionsLimitsSelector);
  const exp = useSelector(avatarsExpSelector);
  const isMissionsPage = location.pathname?.includes('missions');
  const isGamePage = location.pathname?.includes('game');
  let selectAvatarParams;

  if (selectedAvatar === '') {
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

  const onPopupOpen = (e: any) => {
    e.stopPropagation();
    dispatch(toggleMyLandPopup(null));
    dispatch(setFirstVisitFlow(true));
  };

  const onAvatarsSelectOpen = () => {
    if (isMissionsPage) return;
    navigate({ pathname: '/' });
    dispatch(toggleMyLandPopup(null));
    dispatch(switchAvatarsSelectMode(true));
  };

  const nameIdx = userAvatars?.findIndex((item) => item === avatarToDisplay);
  const name = avatarNames?.[nameIdx ?? 0];

  const onAvatarEdit = (e: any) => {
    e.stopPropagation();
    dispatch(setAvatarEdit(selectedAvatar));
    dispatch(switchAvatarsSelectMode(false));
    dispatch(toggleMyLandPopup(null));
  };

  const specialityModification: CSSProperties = {
    bottom: '5px',
    left: '5px',
    position: 'absolute',
    whiteSpace: 'nowrap',
    backgroundColor: 'black',
    margin: '0'
  };

  const buttonModification: CSSProperties = {
    position: 'absolute',
    bottom: '0',
    left: '0'
  };

  const availableMissions = avatarsLimits?.[avatarToDisplay] ?? '...';
  const expValue = exp?.[avatarToDisplay] ?? '100';

  if (!!avatarToDisplay)
    return (
      <CompactAvatarUIWrapper
        isQuestsView={isQuestsView}
        isGamePage={isGamePage}
        src={`${NETWORK_DATA.AVATAR_META}${parseInt(avatarToDisplay)}.jpg`}
        onClick={onAvatarsSelectOpen}
      >
        {isGamePage && <AvatarUiPlay />}
        <ShadowDropAvatar isMissionsPage={isMissionsPage} />
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
          {name?.length && !isMissionsPage ? (
            <Rename onClick={onAvatarEdit}>Rename</Rename>
          ) : null}
          {!name?.length && !isMissionsPage && (
            <NameAvatarButton onClick={onAvatarEdit}>
              Name avatar
            </NameAvatarButton>
          )}

          <AvatarSpeciality style={specialityModification}>
            {`${speciality ?? ''} LVL ${currentLevelFromXp(
              expValue
            )} | XP ${expValue}` ?? <>&nbsp;</>}
          </AvatarSpeciality>
        </>
      </CompactAvatarUIWrapper>
    );

  return NETWORK_DATA.AVATAR_MINTING && !isQuestsView ? (
    <CompactAvatarUIWrapper
      isQuestsView={isQuestsView}
      src={`../avatars/avatarPlaceholder.png`}
      onClick={onAvatarsSelectOpen}
      backgroundSize={'cover'}
    >
      <ShadowDropAvatar />
      <AvatarsUIMintText>
        Mint <br /> your avatar <br /> to run a mission
      </AvatarsUIMintText>
      <CommonButton
        text={`MINT FOR ${NETWORK_DATA.MINT_PRICE} ${NETWORK_DATA.TOKEN_NAME}`}
        onClick={onPopupOpen}
        height="30px"
        mt={16}
        style={buttonModification}
      />
    </CompactAvatarUIWrapper>
  ) : null;
};
