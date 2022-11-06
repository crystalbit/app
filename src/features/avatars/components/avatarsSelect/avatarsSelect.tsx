import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import useCryoChambers from '@features/cryochambers/hooks/useCryoChambers';
import { LootboxItem } from '@features/lootboxes/components/lootboxItem/lootboxItem';
import useOutsideClick from '@global/hooks/useOutsideClick';
import useRoutes from '@global/hooks/useRoutes';
import { ArrowLeft } from '@images/icons/ArrowDown';
import { BackArrow } from '@images/icons/BackArrow';
import { LockIcon } from '@images/icons/LockIcon';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsExpSelector,
  avatarsNamesSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import { userLootboxesListSelector } from '@selectors/lootboxesSliceSelectors';
import {
  addressSelector,
  avatarsMissionsLimitsSelector,
  clnyBalanceSelector
} from '@selectors/userStatsSelectors';
import {
  setAvatarEdit,
  setFirstVisitFlow,
  setSelectedAvatar,
  switchAvatarsSelectMode
} from '@slices/avatarsSlice';
import { setLootboxesList } from '@slices/lootboxesSlice';
import useResizeObserver from 'use-resize-observer';

import { AvatarCard } from '../avatarCard/avatarCard';
import {
  AvatarPopupMobile,
  AvatarsBack,
  AvatarsPopupOverlay,
  AvatarsPopupSubtitle,
  AvatarsPopupTitle,
  MintNewButtonWrapper,
  ModalShadowLayer,
  StorageBack,
  TabsSelectorItem,
  TabsSelectorRowWrapper,
  TabsSelectorWrapper
} from '../avatarsPopup/avatarsPopup.styles';

import {
  AvatarPopupContent,
  AvatarSelectMobileList,
  AvatarsListWrapper,
  AvatarsSelectBackButton,
  AvatarsSelectContent,
  AvatarsSelectEmptyCard,
  AvatarsSelectGhostButton,
  CryochamberContentWrapper,
  CryochamberControlButton,
  CryochamberControlWrapper,
  CryochamberImgWrapper,
  CryochamberLockOverlay,
  CryochamberStatsWrapper,
  CryochamberUIMobile
} from './avatarsSelect.styles';
import useMetamask from '@features/global/hooks/useMetamask';

enum TABS {
  avatars = 'avatars',
  storage = 'storage',
  cryo = 'cryo',
  mission = 'mission'
}

export const AvatarsSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clnyBalance = useSelector(clnyBalanceSelector);
  const {
    cryoChamberInfo,
    getChambersInfo,
    isCryoChamberAvailable,
    buyCryochamber,
    buyCryochamberEnergy,
    getFrozenItems,
    frozenAvas,
    setAvasToCryo,
    getExpectedXPBonus,
    xpBonuses,
    isBuyProcess
  } = useCryoChambers();
  const { isMissionsPage } = useRoutes();

  const { makeCallRequest } = useMetamask();

  const { addToast } = useToasts();
  const [actualTab, setActualTab] = useState(TABS.avatars);
  const [isAvatarCryoSelectMode, setAvatarCryoSelectMode] = useState(false);
  const [selectedToFreeze, setToFreeze] = useState<Array<number | string>>([]);
  const [isLoader, setIsLoader] = useState(false);

  const isAvatarsTab = actualTab === TABS.avatars;
  const isStorageTab = actualTab === TABS.storage;
  const isCryoTab = actualTab === TABS.cryo;

  const overlayRef = useRef<HTMLDivElement>(null);
  const { width, ref } = useResizeObserver();
  const isMobile = width && width < 900;
  const isLootboxesFunc = NETWORK_DATA.LOOTBOXES;
  const isCryoFunctionality = NETWORK_DATA.CRYOCHAMBERS;

  const isLootBoxTab =
    new URLSearchParams(window.location.search).get('tab') === 'storage';

  const userAvatars = useSelector(userAvatarsSelector);
  const userLootboxes = useSelector(userLootboxesListSelector);
  const avatarNames = useSelector(avatarsNamesSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const avatarsLimits = useSelector(avatarsMissionsLimitsSelector);
  const address = useSelector(addressSelector);
  const exp = useSelector(avatarsExpSelector);

  useEffect(() => {
    let timer = setInterval(
      () =>
        isCryoFunctionality ? getFrozenItems(userAvatars ?? []) : () => {},
      60000
    );

    if (isCryoFunctionality) {
      getChambersInfo();
      getFrozenItems(userAvatars ?? []);
      getExpectedXPBonus();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    getChambersInfo,
    getExpectedXPBonus,
    getFrozenItems,
    isCryoFunctionality,
    userAvatars
  ]);

  useEffect(() => {
    if (isLootBoxTab) {
      setActualTab(TABS.storage);
      if (NETWORK_DATA.LOOTBOXES) {
        makeCallRequest<unknown[]>({
          contract: window.LB,
          method: 'allMyTokensPaginate',
          params: [0, 1000],
          address,
          errorText: 'Error getting owned lootboxes list'
        }).then(async (lootboxes) => {
          dispatch(setLootboxesList(lootboxes));
        });
      }
    }
  }, [addToast, address, dispatch, isLootBoxTab]);

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

  const onMintMoreClick = () => {
    dispatch(switchAvatarsSelectMode(false));
    dispatch(setFirstVisitFlow(true));
  };

  const onClose = () => {
    if (isAvatarCryoSelectMode) {
      setToFreeze([]);
      return setAvatarCryoSelectMode(false);
    }
    dispatch(setAvatarEdit(''));
    dispatch(setFirstVisitFlow(false));
    dispatch(switchAvatarsSelectMode(false));

    if (window.location.pathname === '/play') {
      navigate({ pathname: '/play' });
    }
  };

  const onCardSelect = useCallback(
    (token: string) => {
      dispatch(setSelectedAvatar(token));
      localStorage.setItem('selectedAvatar', token);
    },
    [dispatch]
  );

  const emptyCardsLine = useMemo(() => {
    if (isAvatarsTab || isAvatarCryoSelectMode) {
      if (!userAvatars) return;
      return (
        userAvatars?.length <= 6 &&
        new Array(6 - userAvatars.length)
          .fill('')
          .map(() => <AvatarsSelectEmptyCard />)
      );
    }

    if (isStorageTab) {
      if (!userLootboxes) return;
      return (
        userLootboxes?.length <= 6 &&
        new Array(6 - userLootboxes.length)
          .fill('')
          .map(() => <AvatarsSelectEmptyCard minHeight={'230px'} />)
      );
    }

    return [];
  }, [
    isAvatarCryoSelectMode,
    isAvatarsTab,
    isStorageTab,
    userAvatars,
    userLootboxes
  ]);

  const popupOverlayModification: CSSProperties = {
    opacity: 1,
    paddingTop: '25px'
  };
  const ghostButtonModification: CSSProperties = {
    position: 'unset',
    width: '100%'
  };

  const headerContent = useMemo(() => {
    let title;

    switch (actualTab) {
      case TABS.avatars:
        title = `Your avatars: ${userAvatars?.length ?? '-'}`;
        break;
      case TABS.cryo:
        title = 'CRYOchamber';
        break;
      case TABS.storage:
        title = `Your storage (${userLootboxes?.[0]?.length ?? 0})`;
        break;
      case TABS.mission:
        title = `Mission`;
        break;
      default:
        return null;
    }

    const getCryoSubtitle = () => {
      if (isAvatarCryoSelectMode)
        return 'Choose avatars to be stored in the cryochamber';
      return isCryoChamberAvailable
        ? `Avatars stored in the chamber: ${
            frozenAvas?.filter((i) => i !== '0')?.length
          }`
        : 'Earn XP with multiple avatars passively';
    };

    if (isAvatarCryoSelectMode)
      title = `MY AVATARS: ${userAvatars?.length ?? 0}`;

    return (
      <>
        <AvatarsPopupTitle style={isCryoTab ? { marginBottom: 0 } : {}}>
          {title}
        </AvatarsPopupTitle>
        {isCryoTab && (
          <AvatarsPopupSubtitle
            style={
              isMobile
                ? {
                    fontWeight: 400,
                    fontSize: '14px',
                    letterSpacing: '0.04em',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '10px'
                  }
                : {}
            }
          >
            {getCryoSubtitle()}
          </AvatarsPopupSubtitle>
        )}
      </>
    );
  }, [
    actualTab,
    isAvatarCryoSelectMode,
    userAvatars?.length,
    isCryoTab,
    isMobile,
    userLootboxes,
    isCryoChamberAvailable,
    frozenAvas
  ]);

  const getCorrectCryoButtonText = useCallback(() => {
    if (!isCryoChamberAvailable)
      return `Unlock for 120 ${NETWORK_DATA.TOKEN_NAME}`;
    return cryoChamberInfo?.energy === '0'
      ? 'NO FUEL RODS LEFT TO USE'
      : 'CHOOSE AVATARS TO STORE';
  }, [cryoChamberInfo?.energy, isCryoChamberAvailable]);

  const getCorrectCryoPendingText = useCallback(() => {
    if (isBuyProcess) return 'Pending...';
    if (isCryoChamberAvailable && cryoChamberInfo?.energy === '0')
      return 'NO FUEL RODS LEFT TO USE';

    if (!isCryoChamberAvailable && clnyBalance < 120)
      return `Unlock for 120 ${NETWORK_DATA.TOKEN_NAME}`;
  }, [
    clnyBalance,
    cryoChamberInfo?.energy,
    isBuyProcess,
    isCryoChamberAvailable
  ]);

  const tabsContent = useMemo(() => {
    if (isAvatarCryoSelectMode || isMissionsPage) return null;
    return (
      <TabsSelectorRowWrapper>
        <TabsSelectorWrapper>
          <TabsSelectorItem
            onClick={() => setActualTab(TABS.mission)}
            isSelected={actualTab === TABS.mission}
          >
            Mission
          </TabsSelectorItem>
          <TabsSelectorItem
            onClick={() => setActualTab(TABS.avatars)}
            isSelected={actualTab === TABS.avatars}
          >
            Avatars
          </TabsSelectorItem>
          <TabsSelectorItem
            onClick={() => {
              navigate({ pathname: '/play', search: '?tab=cryo' });
              setActualTab(TABS.cryo);
            }}
            isSelected={actualTab === TABS.cryo}
          >
            Cryochamber
          </TabsSelectorItem>
          <TabsSelectorItem
            onClick={() => {
              if (!isLootboxesFunc) return;
              setActualTab(TABS.storage);
            }}
            isSelected={actualTab === TABS.storage}
            isDisabled={!isLootboxesFunc}
          >
            Storage
          </TabsSelectorItem>
        </TabsSelectorWrapper>
      </TabsSelectorRowWrapper>
    );
  }, [actualTab, isAvatarCryoSelectMode, isLootboxesFunc, navigate]);

  const selectToCryo = useCallback(
    (token: string) => {
      if (selectedToFreeze.includes(token)) {
        setToFreeze((frozen) => frozen.filter((i) => i !== token));
      } else {
        if (
          parseInt(cryoChamberInfo?.energy ?? '0') <= selectedToFreeze.length
        ) {
          addToast('Energy limit reached', { appearance: 'error' });
        } else {
          setToFreeze((frozen) => [...frozen, token]);
        }
      }
    },
    [addToast, cryoChamberInfo?.energy, selectedToFreeze]
  );

  const modalContent = useMemo(() => {
    let content;
    const avatarList = (
      <>
        {userAvatars?.map((token, idx) => (
          <AvatarCard
            xp={exp?.[token] ?? '100'}
            missionsLimit={avatarsLimits?.[token] ?? '...'}
            onCardClick={() => {
              if (isLoader) return;

              return isAvatarCryoSelectMode
                ? selectToCryo(token)
                : onCardSelect(token);
            }}
            isSelected={
              isAvatarCryoSelectMode
                ? selectedToFreeze.includes(token)
                : selectedAvatar === token
            }
            metaLink={`${NETWORK_DATA.AVATAR_META}${parseInt(token)}`}
            backgroundImg={`${NETWORK_DATA.AVATAR_META}${parseInt(token)}.jpg`}
            isCryoSelectMode={isAvatarCryoSelectMode}
            isFrozen={parseInt(frozenAvas[idx])}
            xpBonus={xpBonuses?.[idx]}
            name={
              avatarNames?.[idx].length ? avatarNames[idx] : `No Name #${token}`
            }
          />
        ))}
      </>
    );

    if (isAvatarCryoSelectMode)
      return (
        <>
          {avatarList}
          {emptyCardsLine}
        </>
      );

    switch (actualTab) {
      case TABS.avatars:
        content = avatarList;
        break;
      case TABS.cryo:
        content = (
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
                      <span>for 10 {NETWORK_DATA.TOKEN_NAME}</span>
                    </CryochamberControlButton>
                    <CryochamberControlButton
                      onClick={() => buyCryochamberEnergy(5)}
                      disabled={!isCryoChamberAvailable}
                    >
                      <span>Claim 5 fuel rods</span>
                      <span>for 50 {NETWORK_DATA.TOKEN_NAME}</span>
                    </CryochamberControlButton>
                    <CryochamberControlButton
                      onClick={() => buyCryochamberEnergy(25)}
                      disabled={!isCryoChamberAvailable}
                    >
                      <span>Claim 25 fuel rods</span>
                      <span>for 250 {NETWORK_DATA.TOKEN_NAME}</span>
                    </CryochamberControlButton>
                  </CryochamberControlWrapper>

                  <CommonButton
                    pendingText={getCorrectCryoPendingText()}
                    isPending={
                      isBuyProcess ||
                      (isCryoChamberAvailable &&
                        cryoChamberInfo?.energy === '0') ||
                      (!isCryoChamberAvailable && clnyBalance < 120)
                    }
                    text={getCorrectCryoButtonText()}
                    onClick={() => {
                      if (!isCryoChamberAvailable) buyCryochamber();
                      if (
                        isCryoChamberAvailable &&
                        cryoChamberInfo?.energy !== '0'
                      ) {
                        setAvatarCryoSelectMode(true);
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
                          <p>LOCKED</p>
                        </div>
                      </CryochamberLockOverlay>
                    )}
                    {isCryoChamberAvailable && (
                      <CryochamberStatsWrapper>
                        <div>Fuel rods left to use</div>
                        <span>{cryoChamberInfo?.energy ?? '0'}</span>
                      </CryochamberStatsWrapper>
                    )}
                    <CryochamberControlWrapper
                      isBlurred={!isCryoChamberAvailable}
                    >
                      <CryochamberControlButton
                        onClick={() => buyCryochamberEnergy(1)}
                        disabled={!isCryoChamberAvailable}
                      >
                        <span>Claim 1 fuel rods</span>
                        <span>for 10 {NETWORK_DATA.TOKEN_NAME}</span>
                      </CryochamberControlButton>
                      <CryochamberControlButton
                        onClick={() => buyCryochamberEnergy(5)}
                        disabled={!isCryoChamberAvailable}
                      >
                        <span>Claim 5 fuel rods</span>
                        <span>for 50 {NETWORK_DATA.TOKEN_NAME}</span>
                      </CryochamberControlButton>
                      <CryochamberControlButton
                        onClick={() => buyCryochamberEnergy(25)}
                        disabled={!isCryoChamberAvailable}
                      >
                        <span>Claim 25 fuel rod</span>
                        <span>for 250 {NETWORK_DATA.TOKEN_NAME}</span>
                      </CryochamberControlButton>
                    </CryochamberControlWrapper>
                  </CryochamberImgWrapper>
                  <CommonButton
                    pendingText={getCorrectCryoPendingText()}
                    disabled={
                      (isCryoChamberAvailable &&
                        cryoChamberInfo?.energy === '0') ||
                      (!isCryoChamberAvailable && clnyBalance < 120)
                    }
                    isPending={
                      (isCryoChamberAvailable &&
                        cryoChamberInfo?.energy === '0') ||
                      (!isCryoChamberAvailable && clnyBalance < 120)
                    }
                    text={getCorrectCryoButtonText()}
                    onClick={() => {
                      if (!isCryoChamberAvailable) buyCryochamber();
                      if (
                        isCryoChamberAvailable &&
                        cryoChamberInfo?.energy !== '0'
                      ) {
                        setAvatarCryoSelectMode(true);
                      }
                    }}
                    additionalClass="primitive-button"
                  />
                </>
              )}
            </CryochamberContentWrapper>
          </>
        );
        break;
      case TABS.storage:
        content = userLootboxes?.[0].map((id, idx) => (
          <LootboxItem src={id} key={id} rarity={userLootboxes?.[1]?.[idx]} />
        ));
        break;
      default:
        return null;
    }

    return (
      <>
        {content}
        {emptyCardsLine}
      </>
    );
  }, [
    isAvatarCryoSelectMode,
    emptyCardsLine,
    actualTab,
    userAvatars,
    exp,
    avatarsLimits,
    selectedToFreeze,
    selectedAvatar,
    frozenAvas,
    xpBonuses,
    avatarNames,
    isLoader,
    selectToCryo,
    onCardSelect,
    isMobile,
    isCryoChamberAvailable,
    cryoChamberInfo?.energy,
    getCorrectCryoPendingText,
    isBuyProcess,
    clnyBalance,
    getCorrectCryoButtonText,
    userLootboxes,
    buyCryochamberEnergy,
    buyCryochamber
  ]);

  return (
    <div ref={ref}>
      {isMobile && (
        <>
          <AvatarPopupMobile
            style={
              isStorageTab || isCryoTab
                ? {
                    background: 'rgba(0, 0, 0, 0.75)'
                  }
                : {}
            }
          >
            <AvatarsSelectBackButton onClick={onClose}>
              {isAvatarCryoSelectMode ? <ArrowLeft /> : 'Close'}
            </AvatarsSelectBackButton>
            <MintNewButtonWrapper>
              <AvatarsPopupSubtitle mb="2px" />
              {tabsContent}
              {headerContent}
              {!isMissionsPage && isAvatarsTab && !isAvatarCryoSelectMode && (
                <AvatarsSelectGhostButton
                  onClick={onMintMoreClick}
                  style={ghostButtonModification}
                >
                  + MINT NEW
                </AvatarsSelectGhostButton>
              )}
              {isAvatarCryoSelectMode && (
                <AvatarsSelectGhostButton
                  Top={'6px'}
                  disabled={!selectedToFreeze.length || isLoader}
                  onClick={() => {
                    setIsLoader(true);
                    setAvasToCryo(selectedToFreeze, () => {
                      setToFreeze([]);
                      setIsLoader(false);
                    });
                  }}
                >
                  PUT IN CHAMBER
                </AvatarsSelectGhostButton>
              )}
            </MintNewButtonWrapper>
            <AvatarsSelectContent paddingBottom={'100px'}>
              <AvatarSelectMobileList>{modalContent}</AvatarSelectMobileList>
            </AvatarsSelectContent>
          </AvatarPopupMobile>
        </>
      )}
      {!isMobile && (
        <>
          <ModalShadowLayer />
          <AvatarsPopupOverlay
            height="740px"
            width="712px"
            style={popupOverlayModification}
            ref={overlayRef}
          >
            {isAvatarsTab && (
              <AvatarsBack filter="brightness(0.6)" zIndex={'-1'} />
            )}
            {isStorageTab && <StorageBack zIndex={'-1'} />}
            <AvatarsSelectContent>
              <AvatarsSelectBackButton onClick={onClose} leftAvatarsBtn="30px">
                {
                  isAvatarCryoSelectMode ? <BackArrow /> : 'Close' //<CloseAvatarsSelectBackButtonGroup />
                }
              </AvatarsSelectBackButton>
              {tabsContent}
              <AvatarPopupContent marginBottom={'20px'}>
                <AvatarsPopupSubtitle mb="2px" />
                {headerContent}
              </AvatarPopupContent>
              {!isMissionsPage && isAvatarsTab && !isAvatarCryoSelectMode && (
                <AvatarsSelectGhostButton onClick={onMintMoreClick}>
                  + MINT NEW
                </AvatarsSelectGhostButton>
              )}
              {isAvatarCryoSelectMode && (
                <AvatarsSelectGhostButton
                  disabled={!selectedToFreeze.length || isLoader}
                  onClick={() => {
                    setIsLoader(true);
                    setAvasToCryo(selectedToFreeze, () => {
                      setToFreeze([]);
                      setIsLoader(false);
                    });
                  }}
                >
                  PUT IN CHAMBER
                </AvatarsSelectGhostButton>
              )}
              <AvatarsListWrapper
                style={
                  isCryoTab && !isAvatarCryoSelectMode
                    ? { justifyContent: 'center' }
                    : {}
                }
              >
                {modalContent}
              </AvatarsListWrapper>
            </AvatarsSelectContent>
          </AvatarsPopupOverlay>
        </>
      )}
    </div>
  );
};
