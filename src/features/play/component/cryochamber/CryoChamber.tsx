import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useCryoChambers from '@features/cryochambers/hooks/useCryoChambers';
import {
  CryoChamberBlock,
  CryochamberContentWrapper,
  CryochamberControlButton,
  CryochamberControlWrapper,
  CryochamberImgWrapper,
  CryochamberLoaderWrapper,
  CryochamberLockOverlay,
  CryochamberStatsWrapper,
  CryochamberUIMobile
} from '@features/play/component/cryochamber/chyochamber.styles';
import { Loader } from '@global/components/loader/loader';
import useFlags from '@global/hooks/useFlags';
import useOutsideClick from '@global/hooks/useOutsideClick';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { LockIcon } from '@images/icons/LockIcon';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsExpSelector,
  avatarsNamesSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import {
  cryoManagerSelector,
  userGameManagerSelector
} from '@selectors/commonAppSelectors';
import { userLootboxesListSelector } from '@selectors/lootboxesSliceSelectors';
import {
  avatarsMissionsLimitsSelector,
  clnyBalanceSelector
} from '@selectors/userStatsSelectors';
import {
  setAvatarEdit,
  setFirstVisitFlow,
  switchAvatarsSelectMode
} from '@slices/avatarsSlice';
import useResizeObserver from 'use-resize-observer';

import { AvatarsList } from '../avatars/avatarList/AvatarsList';

export const CryoChamber = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clnyBalance = useSelector(clnyBalanceSelector);
  const ch = useSelector(cryoManagerSelector) ?? window.CH;
  const gm = useSelector(userGameManagerSelector) ?? window.GM;

  const {
    cryoChamberInfo,
    getChambersInfo,
    isCryoChamberAvailable,
    buyCryochamber,
    buyCryochamberEnergy,
    getFrozenItems,
    frozenAvas,
    getExpectedXPBonus,
    xpBonuses,
    isBuyProcess
  } = useCryoChambers();

  const { address } = usePersonalInfo();
  const { isCryochamberAvailable, cryoGasPrice } = useFlags();
  const [isAvatarCryoSelectMode, setAvatarCryoSelectMode] =
    useState<boolean>(false);
  const [selectedToFreeze, setToFreeze] = useState<Array<number | string>>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver();
  const isMobile = width && width < 900;

  const userAvatars = useSelector(userAvatarsSelector);
  const userLootboxes = useSelector(userLootboxesListSelector);
  const avatarNames = useSelector(avatarsNamesSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const avatarsLimits = useSelector(avatarsMissionsLimitsSelector);
  const exp = useSelector(avatarsExpSelector);

  useEffect(() => {
    if (!ch || !gm || !address) return;

    let timer = setInterval(() => {
      if (isCryochamberAvailable) {
        getChambersInfo();
        getFrozenItems(userAvatars ?? []);
        getExpectedXPBonus();
      }
    }, 60000);

    if (isCryochamberAvailable) {
      getChambersInfo();
      getExpectedXPBonus();
      getFrozenItems(userAvatars ?? []);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCryochamberAvailable, ch, gm, address, userAvatars]);

  useEffect(() => {
    if (Array.isArray(userAvatars)) getFrozenItems(userAvatars ?? []);
  }, [userAvatars]);

  useOutsideClick(overlayRef, () => {
    dispatch(setAvatarEdit(''));
    dispatch(setFirstVisitFlow(false));
    dispatch(switchAvatarsSelectMode(false));
    setToFreeze([]);
    setAvatarCryoSelectMode(false);

    if (window.location.pathname === '/play') {
      navigate({ pathname: '/play' });
    }
  });

  const getCorrectCryoButtonText = useCallback(() => {
    if (!isCryoChamberAvailable)
      return `Unlock for ${NETWORK_DATA.CHAMBER_PRICE} ${NETWORK_DATA.TOKEN_NAME}`;
    return cryoChamberInfo?.energy === '0'
      ? 'NO FUEL RODS LEFT TO USE'
      : 'CHOOSE AVATARS TO STORE';
  }, [cryoChamberInfo?.energy, isCryoChamberAvailable]);

  const getCorrectCryoPendingText = useCallback(() => {
    if (isBuyProcess) return 'Pending...';
    if (isCryoChamberAvailable && cryoChamberInfo?.energy === '0')
      return 'NO FUEL RODS LEFT TO USE';

    if (!isCryoChamberAvailable && clnyBalance < NETWORK_DATA.CHAMBER_PRICE)
      return `Unlock for ${NETWORK_DATA.CHAMBER_PRICE} ${NETWORK_DATA.TOKEN_NAME}`;
  }, [
    clnyBalance,
    cryoChamberInfo?.energy,
    isBuyProcess,
    isCryoChamberAvailable
  ]);

  const isButtonPending =
    isBuyProcess ||
    (isCryoChamberAvailable && cryoChamberInfo?.energy === '0') ||
    (!isCryoChamberAvailable && clnyBalance < NETWORK_DATA.CHAMBER_PRICE);

  const content = useMemo(() => {
    return (
      <>
        <CryochamberContentWrapper>
          {isMobile ? (
            <>
              <CryochamberUIMobile isBlurred={!isCryoChamberAvailable}>
                <span>{cryoChamberInfo?.energy ?? '0'}</span>
              </CryochamberUIMobile>
              <CryochamberControlWrapper
                Position={'unset'}
                isBlurred={!isCryoChamberAvailable}
              >
                <CryochamberControlButton
                  onClick={() => buyCryochamberEnergy(1)}
                  disabled={!isCryoChamberAvailable}
                >
                  <span>Claim 1 fuel rod</span>
                  <span>
                    {`for ${cryoGasPrice(1)} ${NETWORK_DATA.TOKEN_NAME}`}
                  </span>
                </CryochamberControlButton>
                <CryochamberControlButton
                  onClick={() => buyCryochamberEnergy(5)}
                  disabled={!isCryoChamberAvailable}
                >
                  <span>Claim 5 fuel rods</span>
                  <span>
                    {`for ${cryoGasPrice(5)} ${NETWORK_DATA.TOKEN_NAME}`}
                  </span>
                </CryochamberControlButton>
                <CryochamberControlButton
                  onClick={() => buyCryochamberEnergy(25)}
                  disabled={!isCryoChamberAvailable}
                >
                  <span>Claim 25 fuel rods</span>
                  <span>
                    {`for ${cryoGasPrice(25)} ${NETWORK_DATA.TOKEN_NAME}`}
                  </span>
                </CryochamberControlButton>
              </CryochamberControlWrapper>

              <CommonButton
                pendingText={getCorrectCryoPendingText()}
                isPending={isButtonPending}
                text={getCorrectCryoButtonText()}
                onClick={() => {
                  if (
                    isCryoChamberAvailable &&
                    cryoChamberInfo?.energy !== '0'
                  ) {
                    setAvatarCryoSelectMode(true);
                  } else {
                    buyCryochamber().then(() => {});
                  }
                }}
                additionalClass="primitive-button"
              />
            </>
          ) : (
            <>
              <CryochamberImgWrapper>
                {!isCryoChamberAvailable && (
                  <CryochamberLockOverlay>
                    <div>
                      <LockIcon />
                      <p style={{ color: '#fff' }}>LOCKED</p>
                    </div>
                  </CryochamberLockOverlay>
                )}
                {isCryoChamberAvailable && (
                  <CryochamberStatsWrapper>
                    <div>Fuel rods left to use</div>
                    <span>{cryoChamberInfo?.energy ?? '0'}</span>
                  </CryochamberStatsWrapper>
                )}
                <CryochamberControlWrapper isBlurred={!isCryoChamberAvailable}>
                  <CryochamberControlButton
                    onClick={() => buyCryochamberEnergy(1)}
                    disabled={!isCryoChamberAvailable}
                  >
                    <span>Claim 1 fuel rods</span>
                    {`for ${cryoGasPrice(1)} ${NETWORK_DATA.TOKEN_NAME}`}
                  </CryochamberControlButton>
                  <CryochamberControlButton
                    onClick={() => buyCryochamberEnergy(5)}
                    disabled={!isCryoChamberAvailable}
                  >
                    <span>Claim 5 fuel rods</span>
                    {`for ${cryoGasPrice(5)} ${NETWORK_DATA.TOKEN_NAME}`}
                  </CryochamberControlButton>
                  <CryochamberControlButton
                    onClick={() => buyCryochamberEnergy(25)}
                    disabled={!isCryoChamberAvailable}
                  >
                    <span>Claim 25 fuel rod</span>
                    {`for ${cryoGasPrice(25)} ${NETWORK_DATA.TOKEN_NAME}`}
                  </CryochamberControlButton>
                </CryochamberControlWrapper>
              </CryochamberImgWrapper>
              <CommonButton
                style={{ width: isMobile ? '340px' : '' }}
                pendingText={getCorrectCryoPendingText()}
                disabled={isButtonPending}
                isPending={isButtonPending}
                text={getCorrectCryoButtonText()}
                onClick={() => {
                  if (
                    isCryoChamberAvailable &&
                    cryoChamberInfo?.energy !== '0'
                  ) {
                    setAvatarCryoSelectMode(true);
                  } else {
                    buyCryochamber().then(() => {});
                  }
                }}
                additionalClass="primitive-button"
              />
            </>
          )}
        </CryochamberContentWrapper>
      </>
    );
  }, [
    isAvatarCryoSelectMode,
    userAvatars,
    exp,
    avatarsLimits,
    selectedToFreeze,
    selectedAvatar,
    frozenAvas,
    xpBonuses,
    avatarNames,
    isMobile,
    isCryoChamberAvailable,
    cryoChamberInfo?.energy,
    getCorrectCryoPendingText,
    isBuyProcess,
    clnyBalance,
    getCorrectCryoButtonText,
    userLootboxes,
    buyCryochamberEnergy,
    buyCryochamber,
    isButtonPending
  ]);

  if (!cryoChamberInfo && address)
    return (
      <CryochamberLoaderWrapper>
        <Loader />
      </CryochamberLoaderWrapper>
    );

  if (!address.length) {
    return <CryoChamberBlock>{content}</CryoChamberBlock>;
  }

  return (
    <CryoChamberBlock flag={isAvatarCryoSelectMode}>
      {isAvatarCryoSelectMode ? (
        <AvatarsList
          isAvatarCryoSelectMode={isAvatarCryoSelectMode}
          setAvatarCryoSelectMode={setAvatarCryoSelectMode}
        />
      ) : (
        content
      )}
    </CryoChamberBlock>
  );
};
