import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAvatars } from '@avatars/hooks/useAvatars';
import { GearModal } from '@features/gear/components/modal/gearModal';
import useLootboxes from '@features/lootboxes/hooks/useLootboxes';
import Layout from '@global/components/layout/layout';
import {
  BALANCE_CHECKER_INTERVAL,
  CLNY_PRICE_CHECK_TICK
} from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useFlags from '@global/hooks/useFlags';
import useGameManagement from '@global/hooks/useGameManagement';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import useRoutes from '@global/hooks/useRoutes';
import { extractURLParam } from '@global/utils/urlParams';
import { AppDispatch } from '@redux/store';
import { AvatarsPopup } from '@root/features/avatars/components/avatarsPopup/avatarsPopup';
import { AvatarsSelect } from '@root/features/avatars/components/avatarsSelect/avatarsSelect';
import { RevshareModal } from '@root/features/sharing/components/revshareModal';
import { NETWORK_DATA } from '@root/settings';
import { isRevShareModalSelector } from '@selectors/appPartsSelectors';
import {
  isAvatarSelectMode,
  isAvatarsPopupOpened,
  isAvatarToEditSelector
} from '@selectors/avatarsSelectors';
import * as Sentry from '@sentry/react';
import { dropGameInfo } from '@slices/gameManagementSlice';
import { setClnyPrice } from '@slices/lootboxesSlice';

function DataProvider({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { isFarmingPage, isQuestPage, isRefPage, isMiningPage } = useRoutes();

  const dispatch = useDispatch<AppDispatch>();

  const { collectAllLandInfo } = useGameManagement();
  const { initializeUserAvatar } = useAvatars();
  const { web3Instance, address, isInitialized } = usePersonalInfo(true);
  const { getOracleCLNYPrice } = useLootboxes();

  const { tokens, updateEarnedAll, updateCLNYBalance } = useBalance();
  const { isAvatarsAvailable, isBalanceCheckerTick, isLootboxesAvailable } =
    useFlags();

  const isAvatarsPopupShown = useSelector(isAvatarsPopupOpened);
  const isAvatarToEdit = useSelector(isAvatarToEditSelector);
  const isAvatarSelectOpened = useSelector(isAvatarSelectMode);
  const isRevshareModal = useSelector(isRevShareModalSelector);

  useEffect(() => {
    const id = extractURLParam(location, 'id');
    const isInitializedUser = Boolean(
      id && web3Instance && address && tokens && window.GM?.methods
    );

    if (isInitializedUser && id) {
      collectAllLandInfo(id).then(() => {});
    }

    if (location.pathname === '/') {
      dispatch(dropGameInfo());
    }
  }, [location.pathname, location.search, web3Instance, address, tokens]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isInitialized && NETWORK_DATA.ORACLE !== '') {
      getOracleCLNYPrice((price) => dispatch(setClnyPrice(price))).then();
      interval = setInterval(
        async () =>
          await getOracleCLNYPrice((price) => dispatch(setClnyPrice(price))),
        CLNY_PRICE_CHECK_TICK
      );
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInitialized]);

  useEffect(() => {
    if (!isAvatarsAvailable) return;
    if (!web3Instance || !address || !window.AM) return;
    initializeUserAvatar(address).then(() => {});
  }, [web3Instance, address, tokens, isAvatarsAvailable]);

  React.useEffect(() => {
    if (!address) return;
    updateEarnedAll().then(() => {});

    if (isBalanceCheckerTick) {
      const balanceChecker = setInterval(async () => {
        await updateEarnedAll();
      }, BALANCE_CHECKER_INTERVAL);

      return () => {
        clearInterval(balanceChecker);
      };
    }
  }, [isBalanceCheckerTick, updateEarnedAll, address]);

  if (isFarmingPage || isQuestPage || isRefPage || isMiningPage)
    return (
      <>
        {children}
        {isAvatarSelectOpened && <AvatarsSelect />}
      </>
    );

  return (
    <>
      <Layout>{children}</Layout>
      {isRevshareModal && <RevshareModal />}
      {(isAvatarsPopupShown || isAvatarToEdit) && isAvatarsAvailable && (
        <AvatarsPopup onBalanceUpdate={updateCLNYBalance} />
      )}
      {isLootboxesAvailable && <GearModal />}
    </>
  );
}

export default Sentry.withProfiler(DataProvider);
