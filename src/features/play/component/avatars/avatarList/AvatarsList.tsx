import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { useToasts } from 'react-toast-notifications';
import QuestsBackend from '@api/questsBackend';
import useCryoChambers from '@features/cryochambers/hooks/useCryoChambers';
import { PROFESSION_RARITY } from '@features/global/constants';
import { customStylesSelect } from '@features/global/styles/select';
import {
  AvatarsSelectEmptyCard,
  CryochamberBackNavButton
} from '@features/play/component/cryochamber/chyochamber.styles';
import { Loader } from '@global/components/loader/loader';
import { useBalance } from '@global/hooks/useBalance';
import useContracts from '@global/hooks/useContracts';
import useFlags from '@global/hooks/useFlags';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { trackUserEvent } from '@global/utils/analytics';
import { ArrowLeft } from '@images/icons/ArrowDown';
import { CommonButton } from '@root/legacy/buttons/commonButton';
import { NETWORK_DATA } from '@root/settings';
import {
  avatarsExpSelector,
  avatarsNamesSelector,
  filterUserAvatarsSelector,
  isAvatarSaving,
  isAvatarsMinting,
  isAvatarToEditSelector,
  selectedAvatarSelector,
  userAvatarsSelector
} from '@selectors/avatarsSelectors';
import {
  avatarsMissionsLimitsSelector,
  clnyBalanceSelector
} from '@selectors/userStatsSelectors';
import {
  closeAvatarPopup,
  fetchAvatarsData,
  setFirstVisitFlow,
  setSelectedAvatar
} from '@slices/avatarsSlice';
import {
  setAvatarsMissionsLimits,
  setLandsMissionsLimits
} from '@slices/userStatsSlice';

import { AvatarCard } from '../avatarCard/avatarCard';
import { AvatarMain } from '../AvatarMain';

import {
  AvatarCardBlock,
  AvatarHeaderBlock,
  AvatarListBlock,
  BlockButtonAvatar,
  NoAvatar,
  SelectBlock,
  TitleBlock
} from './avatarList.styled';

interface AvatarsListProps {
  isAvatarCryoSelectMode?: boolean;
  setAvatarCryoSelectMode?: Dispatch<SetStateAction<boolean>>;
}

interface Option {
  value: any;
  label: string;
  key: string;
}

export const AvatarsList = ({
  isAvatarCryoSelectMode = false,
  setAvatarCryoSelectMode
}: AvatarsListProps) => {
  const userAvatars = useSelector(userAvatarsSelector);
  const filterUserAvatars = useSelector(filterUserAvatarsSelector);
  const avatarNames = useSelector(avatarsNamesSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);
  const avatarsLimits = useSelector(avatarsMissionsLimitsSelector);
  const exp = useSelector(avatarsExpSelector);
  const clnyBalance = useSelector(clnyBalanceSelector);
  const [isLoader, setIsLoader] = useState(false);
  const [selectedToFreeze, setToFreeze] = useState<Array<number | string>>([]);
  const {
    cryoChamberInfo,
    isCryoChamberAvailable,
    buyCryochamber,
    buyCryochamberEnergy,
    frozenAvas,
    setAvasToCryo,
    xpBonuses,
    isBuyProcess,
    getFrozenItems,
    getChambersInfo,
    getExpectedXPBonus
  } = useCryoChambers();
  const { cryoManager, gameManager } = useContracts();
  const { tokens } = useBalance();
  const { address } = usePersonalInfo();
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const { isAvatarsMintingAvailable, isMissionsAvailable } = useFlags();
  const [isInitialLoad, setInitialLoad] = useState(
    !Boolean(userAvatars?.length)
  );
  useEffect(() => {
    setTimeout(() => setInitialLoad(false), 2500);
  }, []);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [filterKey, setFilterKey] = useState<string | undefined>('');
  const [countFilter, setCountFilter] = useState<number>(0);
  const [loadingFilter, setLoadingFilter] = useState<boolean>(false);

  useEffect(() => {
    if (
      userAvatars !== null &&
      typeof selectedOptions === 'string' &&
      typeof filterKey === 'string'
    ) {
      setLoadingFilter(true);
      dispatch(
        fetchAvatarsData({
          link: `${
            NETWORK_DATA.AVATAR_META
          }tokens?id=${userAvatars.toString()}`,
          selectedOptions,
          filterKey
        })
      );
    } else if (selectedOptions === undefined && userAvatars !== null) {
      setCountFilter(userAvatars.length);
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (
      (typeof selectedOptions !== 'string' || selectedOptions === undefined) &&
      userAvatars !== null
    ) {
      setCountFilter(userAvatars.length);
    } else {
      setCountFilter(filterUserAvatars.length);
      setLoadingFilter(false);
    }
  }, [filterUserAvatars, userAvatars]);

  useEffect(() => {
    if (!cryoManager || !gameManager || !address) return;

    getChambersInfo();
    getExpectedXPBonus();
    getFrozenItems(userAvatars ?? []);

    if (isMissionsAvailable) {
      QuestsBackend.getLimits({
        landIds: tokens ?? [],
        avatarIds: userAvatars ?? []
      }).then((missions) => {
        dispatch(setLandsMissionsLimits(missions?.lands));
        dispatch(setAvatarsMissionsLimits(missions?.avatars));
      });
    }
  }, [userAvatars, cryoManager, userAvatars, address]);

  const selectToCryoChamber = useCallback(
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

  const onCardSelect = useCallback(
    (token: string) => {
      dispatch(setSelectedAvatar(token));
      localStorage.setItem('selectedAvatar', token);
    },
    [dispatch]
  );

  const emptyCardsLine = useMemo(() => {
    if (isAvatarCryoSelectMode) {
      if (!userAvatars) return;
      return (
        userAvatars?.length <= 6 &&
        new Array(6 - userAvatars.length)
          .fill('')
          .map((_, index) => <AvatarsSelectEmptyCard key={index} />)
      );
    }

    return [];
  }, [isAvatarCryoSelectMode, userAvatars]);

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

  const isMinting = useSelector(isAvatarsMinting);
  const isAvatarSave = useSelector(isAvatarSaving);
  const isAvatarToEdit = useSelector(isAvatarToEditSelector);
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

  const getMintButtonText = () => {
    return isAvatarsMintingAvailable ? 'Mint new avatar' : 'Buy avatar';
  };

  const modalContent = useMemo(() => {
    const avatarList = (
      <>
        {typeof selectedOptions !== 'string' ? (
          userAvatars?.map((token, idx) => (
            <AvatarCard
              key={token}
              xp={exp?.[token] ?? '100'}
              missionsLimit={avatarsLimits?.[token] ?? '...'}
              onCardClick={() => {
                if (isLoader) return;

                if (!isAvatarCryoSelectMode) {
                  trackUserEvent('Select to play clicked', { token });
                } else {
                  trackUserEvent('Choose avatar to store clicked', { token });
                }

                return isAvatarCryoSelectMode
                  ? selectToCryoChamber(token)
                  : onCardSelect(token);
              }}
              isSelected={
                isAvatarCryoSelectMode
                  ? selectedToFreeze.includes(token)
                  : selectedAvatar === token
              }
              metaLink={`${NETWORK_DATA.AVATAR_META}${parseInt(token)}`}
              backgroundImg={`${NETWORK_DATA.AVATAR_META}${parseInt(
                token
              )}.jpg`}
              isCryoSelectMode={isAvatarCryoSelectMode}
              isFrozen={parseInt(frozenAvas?.[idx])}
              xpBonus={xpBonuses?.[idx]}
              tokenNum={token}
              name={
                avatarNames?.[idx]?.length
                  ? avatarNames?.[idx]
                  : `No Name #${token}`
              }
            />
          ))
        ) : filterUserAvatars?.length !== 0 ? (
          filterUserAvatars?.map((token, idx) => (
            <AvatarCard
              key={token.id}
              xp={exp?.[token.id] ?? '100'}
              missionsLimit={avatarsLimits?.[token.id] ?? '...'}
              onCardClick={() => {
                if (isLoader) return;

                return isAvatarCryoSelectMode
                  ? selectToCryoChamber(token.id)
                  : onCardSelect(token.id);
              }}
              isSelected={
                isAvatarCryoSelectMode
                  ? selectedToFreeze.includes(token.id)
                  : selectedAvatar === token.id
              }
              metaLink={`${NETWORK_DATA.AVATAR_META}${parseInt(token.id)}`}
              backgroundImg={`${NETWORK_DATA.AVATAR_META}${parseInt(
                token.id
              )}.jpg`}
              isCryoSelectMode={isAvatarCryoSelectMode}
              isFrozen={parseInt(frozenAvas?.[idx])}
              xpBonus={xpBonuses?.[idx]}
              tokenNum={token.id}
              name={
                avatarNames?.[idx]?.length
                  ? avatarNames?.[idx]
                  : `No Name #${token.id}`
              }
            />
          ))
        ) : (
          <NoAvatar>No Avatars</NoAvatar>
        )}
      </>
    );

    return (
      <>
        {avatarList}
        {emptyCardsLine}
      </>
    );
  }, [
    selectedOptions,
    filterUserAvatars,
    isAvatarCryoSelectMode,
    emptyCardsLine,
    userAvatars,
    exp,
    avatarsLimits,
    selectedToFreeze,
    selectedAvatar,
    frozenAvas,
    xpBonuses,
    avatarNames,
    isLoader,
    selectToCryoChamber,
    onCardSelect,
    isCryoChamberAvailable,
    cryoChamberInfo?.energy,
    getCorrectCryoPendingText,
    isBuyProcess,
    clnyBalance,
    buyCryochamberEnergy,
    buyCryochamber
  ]);

  if (isInitialLoad) return <Loader />;

  return (
    <>
      {!address.length ||
      userAvatars?.length === undefined ||
      userAvatars?.length === 0 ? (
        <AvatarMain />
      ) : (
        <AvatarListBlock>
          <AvatarHeaderBlock>
            <TitleBlock>
              {isAvatarCryoSelectMode && (
                <CryochamberBackNavButton
                  onClick={() => setAvatarCryoSelectMode?.(false)}
                >
                  <ArrowLeft />
                </CryochamberBackNavButton>
              )}
              <p>MY AVATARS: {loadingFilter ? '...' : countFilter}</p>
            </TitleBlock>

            <SelectBlock>
              <Select
                styles={customStylesSelect}
                isClearable={true}
                options={PROFESSION_RARITY}
                placeholder="Filter"
                defaultValue={selectedOptions as Option[]}
                onChange={(event) => {
                  setFilterKey(event?.key);
                  setSelectedOptions(event?.value);
                }}
              />
            </SelectBlock>
          </AvatarHeaderBlock>

          <AvatarCardBlock>{modalContent}</AvatarCardBlock>

          <BlockButtonAvatar>
            {isAvatarCryoSelectMode ? (
              <CommonButton
                text="PUT IN CHAMBER"
                onClick={async () => {
                  setIsLoader(true);
                  trackUserEvent('Put in chamber clicked', {
                    avatars: selectedToFreeze
                  });
                  await setAvasToCryo(selectedToFreeze, () => {
                    setToFreeze([]);
                    setIsLoader(false);
                  });
                }}
                disabled={!selectedToFreeze.length || isLoader}
                style={{
                  cursor: 'pointer',
                  margin: '0',
                  maxWidth: '308px',
                  alignSelf: 'center',
                  borderRadius: '6px',
                  width: '100vw'
                }}
              />
            ) : (
              <CommonButton
                text={getMintButtonText()}
                onClick={onMarketNavigation}
                height="50px"
                mt={24}
                disabled={false}
                isPending={false}
                pendingText={getPendingButtonText()}
                style={{
                  cursor: 'pointer',
                  margin: '0',
                  maxWidth: '308px',
                  alignSelf: 'center',
                  borderRadius: '6px'
                }}
              />
            )}
          </BlockButtonAvatar>
        </AvatarListBlock>
      )}
    </>
  );
};
