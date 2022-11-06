import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import QuestsBackend from '@api/questsBackend';
import { useAvatars } from '@avatars/hooks/useAvatars';
import useAvatarsMeta from '@avatars/hooks/useAvatarsMeta';
import YoutubeEmbed from '@global/components/youtubeFrame/youtubeFrame';
import useOutsideClick from '@global/hooks/useOutsideClick';
import { trackUserEvent } from '@global/utils/analytics';
import apiRetry from '@global/utils/apiRetry';
import { AvatarBodyFrame } from '@images/icons/AvatarBodyFrame';
import { CloseIcon } from '@images/icons/CloseIcon';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsNamesSelector,
  isAvatarSaving,
  isAvatarsMinting,
  isAvatarToEditSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import {
  addressSelector,
  clnyBalanceSelector
} from '@selectors/userStatsSelectors';
import {
  closeAvatarPopup,
  setAvatarEdit,
  setAvatarMinting,
  setAvatarsNamesList,
  setFirstVisitFlow,
  setIsAvatarSaving,
  setSelectedAvatar,
  setUserAvatarsList,
  switchAvatarsSelectMode
} from '@slices/avatarsSlice';
import { setAvatarsMissionsLimits } from '@slices/userStatsSlice';
import mixpanel from 'mixpanel-browser';
import useResizeObserver from 'use-resize-observer';

import { AvatarSpeciality } from '../avatarCard/avatarCard.styles';
import { AvatarsSelectBackButton } from '../avatarsSelect/avatarsSelect.styles';

import {
  AvatarImageBody,
  AvatarInputTitle,
  AvatarPopupNewTitle,
  AvatarsBack,
  AvatarsBackWrapper,
  AvatarsNickInput,
  AvatarsNickInputWrapper,
  AvatarsPopupContent,
  AvatarsPopupOverlay,
  AvatarsPopupSpecialityWrapper,
  AvatarsVideoTitle,
  AvatarsVideoWrapper,
  AvatarTitle,
  InnerContentWrapper,
  InputErrorText,
  LevelCounterWrapper,
  ModalShadowLayer,
  Paragraph
} from './avatarsPopup.styles';

type AvatarsPopupProps = {
  onBalanceUpdate: (address: string) => void;
};

export const AvatarsPopup = ({ onBalanceUpdate }: AvatarsPopupProps) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { addToast } = useToasts();

  const isMinting = useSelector(isAvatarsMinting);
  const address = useSelector(addressSelector);
  const isAvatarSave = useSelector(isAvatarSaving);
  const userAvatars = useSelector(userAvatarsSelector);
  const isAvatarToEdit = useSelector(isAvatarToEditSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const isMissionsPage = !NETWORK_DATA.AVATAR_MINTING && !userAvatars?.length; // TODO refactor

  const clnyBalance = useSelector(clnyBalanceSelector);
  const isAvatarsForQuestsNeeded =
    !NETWORK_DATA.AVATAR_MINTING && !userAvatars?.length && !selectedAvatar; // TODO refactor

  const overlayRef = useRef<HTMLDivElement>(null);
  const { ref } = useResizeObserver();

  const { speciality } = useAvatarsMeta(
    `${NETWORK_DATA.AVATAR_META}${isAvatarToEdit}`
  );

  const {
    mintAvatar,
    getUserAvatars,
    assignNameToAvatar,
    getAvatarsNames,
    renameAvatar,
    isAbleToMint
  } = useAvatars();

  const onPopupClose = () => {
    if (isAvatarSave || isMinting) return;
    dispatch(closeAvatarPopup());
  };

  useOutsideClick(overlayRef, () => {
    if (isAvatarSave || isMinting || isAvatarsForQuestsNeeded) return;
    onPopupClose();
  });

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const onPopupClosed = () => {
    localStorage.setItem('avatarSuggested', 'true');
    dispatch(setFirstVisitFlow(false));
    dispatch(setAvatarEdit(undefined));
    if (isAvatarsForQuestsNeeded && isMissionsPage) {
      navigator('/');
    }
  };

  const getInputValidation = useCallback(() => {
    if (inputValue.length > 14)
      return setError('Should be shorter than 15 symbols');
    if (inputValue.length && !inputValue.trim())
      return setError('You can’t use this symbol');
    else return setError('');
  }, [inputValue]);

  const onAvatarMint = async () => {
    dispatch(setAvatarMinting(true));
    try {
      const isAble = await isAbleToMint();
      if (!isAble) {
        addToast(`Minting limit reached`, {
          appearance: 'error'
        });
        dispatch(setAvatarMinting(false));
        return;
      }
      await mintAvatar();
      await new Promise((rs) => setTimeout(rs, 5000));
      const avatars = await getUserAvatars();

      const url = `${NETWORK_DATA.AVATAR_META}minted/${
        avatars[avatars.length - 1]
      }?${Math.random()}`;

      await apiRetry(10, url, 'minted');

      const names = await getAvatarsNames(avatars);

      // const myLast = await getMyLastMintedAvatar(); // а вдруг потребуется

      dispatch(setUserAvatarsList(avatars));
      dispatch(setAvatarsNamesList(names));
      // dispatch(setAvatarEdit(avatars[avatars.length - 1]));
      dispatch(setAvatarEdit(undefined));
      dispatch(setSelectedAvatar(avatars[avatars.length - 1]));
      dispatch(setAvatarMinting(false));
      dispatch(setFirstVisitFlow(false));
      onBalanceUpdate(address);
    } catch (err) {
      dispatch(setAvatarMinting(false));
      dispatch(setFirstVisitFlow(true));
    }
  };

  useEffect(() => {
    (async () => {
      const limits = await QuestsBackend.getLimits({
        // @ts-ignore
        avatarIds: userAvatars,
        landIds: []
      });
      dispatch(setAvatarsMissionsLimits(limits?.avatars));
    })();
  }, [dispatch, userAvatars, userAvatars?.length]);

  const onMarketNavigation = () => {
    dispatch(closeAvatarPopup());
    window.open('https://nftkey.app/collections/marscolony', '_blank');
    return true;
  };

  const avatarNames = useSelector(avatarsNamesSelector);
  const avatarToDisplay = useMemo(() => {
    if (isAvatarToEdit) return isAvatarToEdit;

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
  }, [selectedAvatar, userAvatars, dispatch, isAvatarToEdit]);

  const nameIdx = userAvatars?.findIndex((item) => item === avatarToDisplay);
  const name = avatarNames?.[nameIdx ?? 0];

  const onAvatarSave = async () => {
    trackUserEvent('Rename avatar clicked');
    setInputValue('');
    if (!isAvatarToEdit) return;
    dispatch(setIsAvatarSaving(true));
    try {
      if (name?.length === 0) {
        await assignNameToAvatar(isAvatarToEdit, inputValue);
      } else {
        await renameAvatar(isAvatarToEdit, inputValue);
        trackUserEvent('Rename avatar succeed');
        mixpanel.track('Success Rename', { address, id: nameIdx });
      }
      onBalanceUpdate(address);
    } catch (err) {
      trackUserEvent('Rename avatar failed');
      dispatch(setIsAvatarSaving(false));
      return;
    }

    await new Promise((rs) => setTimeout(rs, 3000));

    try {
      const userAvatars = await getUserAvatars();
      const avatarsNames = await getAvatarsNames(userAvatars);
      dispatch(setUserAvatarsList(userAvatars));
      dispatch(setAvatarsNamesList(avatarsNames));
      dispatch(setSelectedAvatar(isAvatarToEdit));
      dispatch(setIsAvatarSaving(false));
      onPopupClosed();
    } catch (err) {
      dispatch(setIsAvatarSaving(false));
      onPopupClosed();
    }
  };

  const getPendingButtonText = () => {
    if (isMinting) return 'Minting...';
    if (isAvatarSave) return 'Saving...';
    if (!isAvatarToEdit) {
      return NETWORK_DATA.AVATAR_MINTING
        ? `Mint for ${NETWORK_DATA.MINT_PRICE} ${NETWORK_DATA.TOKEN_NAME}`
        : 'Mint unavailable';
    } else {
      if (name?.length === 0) {
        return 'Done';
      } else {
        return `Rename for 25 ${NETWORK_DATA.TOKEN_NAME}`;
      }
    }
  };

  useEffect(() => {
    getInputValidation();
  }, [getInputValidation, inputValue]);

  const [valueChange, setValueChange] = useState(name);

  useEffect(() => {
    const nameIdx = userAvatars?.findIndex((item) => item === isAvatarToEdit);
    const name = avatarNames?.[nameIdx ?? 0];
    setValueChange(name);
  }, [isAvatarToEdit]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^A-Za-z +]/gi, '');
    setValueChange(value);
    setInputValue(value);
  };

  const buttonDynamicText = useMemo(() => {
    if (isAvatarsForQuestsNeeded) {
      return 'Get an avatar';
    } else {
      if (isAvatarToEdit) {
        return name?.length
          ? `Rename for 25 ${NETWORK_DATA.TOKEN_NAME}`
          : 'Done';
      } else {
        return `Mint for ${NETWORK_DATA.MINT_PRICE} ${NETWORK_DATA.TOKEN_NAME}`;
      }
    }
  }, [isAvatarsForQuestsNeeded, isAvatarToEdit, name]);

  const isPendingStatus =
    isMinting ||
    (isAvatarToEdit && !inputValue.length) ||
    !!error ||
    isAvatarSave ||
    (!isAvatarToEdit && !NETWORK_DATA.AVATAR_MINTING);

  const isDisabledStatus =
    !isAvatarToEdit &&
    clnyBalance < NETWORK_DATA.MINT_PRICE &&
    !isAvatarsForQuestsNeeded;

  const onButtonClick = () => {
    if (isAvatarsForQuestsNeeded) {
      return onMarketNavigation();
    } else {
      return isAvatarToEdit ? onAvatarSave() : onAvatarMint();
    }
  };

  const title = useMemo(() => {
    if (isAvatarsForQuestsNeeded) {
      return 'You’re almost there martian avatar is needed to play';
    } else {
      if (userAvatars && userAvatars.length > 0) {
        return name?.length ? 'YOUR AVATAR' : 'Name your avatar';
      } else return 'Mint your avatar';
    }
  }, [userAvatars, name, isAvatarsForQuestsNeeded]);

  return (
    <div ref={ref}>
      <>
        <ModalShadowLayer />
        <AvatarsPopupOverlay ref={overlayRef}>
          <AvatarsBackWrapper>
            <AvatarsBack />
          </AvatarsBackWrapper>

          <AvatarsPopupContent
            Top={Boolean(name?.length) ? '' : '60px'}
            largeTopMargin={Boolean(name?.length)}
          >
            {isMissionsPage ? (
              <>
                <AvatarsSelectBackButton
                  style={{ top: '-25px', left: '15px' }}
                  onClick={() => {
                    dispatch(setAvatarEdit(''));
                    dispatch(setFirstVisitFlow(false));
                    dispatch(switchAvatarsSelectMode(false));
                    if (isAvatarsForQuestsNeeded && isMissionsPage) {
                      navigator('/');
                    }
                  }}
                >
                  <CloseIcon />
                </AvatarsSelectBackButton>
                <AvatarsVideoWrapper>
                  <AvatarsVideoTitle>
                    You’re almost there martian
                    <br /> avatar is needed to play
                  </AvatarsVideoTitle>
                  <YoutubeEmbed embedId="KM_4kBPfjvo" />
                  <CommonButton
                    text="Buy avatar on NFTKEY"
                    onClick={onMarketNavigation}
                    height="50px"
                    mt={24}
                    disabled={false}
                    isPending={false}
                    pendingText={getPendingButtonText()}
                    style={{ maxWidth: '308px', alignSelf: 'center' }}
                  />
                  <CommonButton
                    isGhost
                    isPending={isMinting}
                    text="I’ll do it later, thanks"
                    onClick={onPopupClosed}
                    mt={10}
                  />
                </AvatarsVideoWrapper>
              </>
            ) : (
              <>
                {name?.length ? (
                  <AvatarTitle flag={Boolean(isAvatarToEdit)}>
                    Choose and type new name for
                  </AvatarTitle>
                ) : null}
                <InnerContentWrapper>
                  <AvatarPopupNewTitle>{title}</AvatarPopupNewTitle>
                  {(!isAvatarToEdit || isAvatarsForQuestsNeeded) && (
                    <AvatarImageBody src="../avatars/avatarPlaceholder.png">
                      {isAvatarsForQuestsNeeded && (
                        <Paragraph Position="absolute">
                          All avatars have been minted already. You can buy one
                          on the
                          <a
                            href="https://nftkey.app/collections/marscolony"
                            rel="nofollow noreferrer"
                            target="_blank"
                          >
                            secondary market.
                          </a>
                        </Paragraph>
                      )}
                      <p>
                        {' '}
                        <a
                          href="https://people.marscolony.io/t/avatar-nft-collections-explanation/4320"
                          rel="nofollow noreferrer"
                          target="_blank"
                        >
                          Learn more
                        </a>{' '}
                        about avatars.
                      </p>
                    </AvatarImageBody>
                  )}
                  {isAvatarToEdit && (
                    <AvatarImageBody
                      src={`${NETWORK_DATA.AVATAR_META}${parseInt(
                        isAvatarToEdit
                      )}.jpg`}
                    >
                      <AvatarBodyFrame />
                      <LevelCounterWrapper>LVL 1 | XP 100</LevelCounterWrapper>
                      <AvatarsNickInputWrapper>
                        <AvatarInputTitle>
                          {Boolean(name?.length)
                            ? 'Rename your avatar'
                            : 'Name your avatar'}
                        </AvatarInputTitle>
                        <AvatarsNickInput
                          value={valueChange}
                          onChange={onInputChange}
                          disabled={isAvatarSave}
                        />
                        {error && <InputErrorText>{error}</InputErrorText>}
                        {speciality && !error && (
                          <AvatarsPopupSpecialityWrapper>
                            <AvatarSpeciality>{speciality}</AvatarSpeciality>
                          </AvatarsPopupSpecialityWrapper>
                        )}
                      </AvatarsNickInputWrapper>
                    </AvatarImageBody>
                  )}

                  <CommonButton
                    text={buttonDynamicText}
                    onClick={onButtonClick}
                    height="50px"
                    mt={16}
                    disabled={isDisabledStatus}
                    isPending={isPendingStatus}
                    pendingText={getPendingButtonText()}
                  />

                  {!isMinting && (
                    <CommonButton
                      isGhost
                      isPending={isMinting}
                      text={
                        isAvatarsForQuestsNeeded
                          ? 'Cancel'
                          : 'I’ll do it later, thanks'
                      }
                      onClick={onPopupClosed}
                      mt={10}
                    />
                  )}
                </InnerContentWrapper>
              </>
            )}
          </AvatarsPopupContent>
        </AvatarsPopupOverlay>
      </>
    </div>
  );
};
