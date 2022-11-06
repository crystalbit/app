import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import PolygonBackend from '@api/polygonBackend';
import ToggleSwitch from '@features/global/components/toggler/toggleButton';
import { freeReserve } from '@features/globus/utils/reserveHelper';
import { LandPlot } from '@features/lands/components/land/LandPlot';
import { CartContent } from '@features/lands/components/landsSidebar/cartContent/cartContent';
import useLands from '@features/lands/hooks/useLands';
import { FlexedPlotDivider } from '@features/lands/styles/landPlot.styles';
import {
  LandPlotEnhancementsBlock,
  LandPlotNewIconWrapper,
  LandPlotNewImageWrapper,
  LandPlotNewName,
  LandPlotNewRemove,
  LandPlotOuterWrapper,
  LandPlotTitleLine
} from '@features/lands/styles/landPlotNew.styles';
import { getClnySpeedLabel } from '@features/lands/utils/formating';
import { navigateToGlobeLand } from '@features/lands/utils/globusNavigation';
import { useRevshare } from '@features/revshare/hooks/useRevshare';
import useSharing from '@features/sharing/hooks/useSharing';
import Button from '@global/components/button';
import { Loader } from '@global/components/loader/loader';
import { GAP_TEXT, LINKS, MOBILE_BREAKPOINT } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import { useBalance } from '@global/hooks/useBalance';
import useFlags from '@global/hooks/useFlags';
import useMediaQuery from '@global/hooks/useMediaQuery';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import { MarsNavMyLandClose, TokensWrapper } from '@global/styles/app.styles';
import { generateBlockie } from '@global/utils/blockie.canvas';
import { fromWeiValue } from '@global/utils/fromWei';
import { ArrowLeft, ArrowRight } from '@images/icons/ArrowDown';
import { CloseIcon } from '@images/icons/CloseIcon';
import { LandPinIcon } from '@images/icons/LandPinIcon';
import {
  CartCloseIconWrapper,
  RevenuButtonWrapper
} from '@root/legacy/navbar.styles';
import { NETWORK_DATA } from '@root/settings';
import {
  setLandPageNumber,
  setRevshareModalState,
  toggleMyLandPopup
} from '@slices/appPartsSlice';
import { deleteItemFromChart, toggleCartSidebar } from '@slices/cartSlice';

import {
  ActiveLandsControlWrapper,
  ActiveLandsFirstLine,
  ActiveLandsTitle,
  ButtonSubText,
  LandsBlock,
  LandsSidebarHeaderWrapper,
  LandsSidebarWrapper,
  NoLandsTitle
} from './landsSidebar.styles';

export const LandsSidebar = () => {
  const dispatch = useDispatch();
  const { isLandsSidebarOpened: sidebarType } = useAppParts();
  const { tokens } = useBalance();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const getContent = () => {
    if (sidebarType === 'cart') {
      return <CartList />;
    }
    if (sidebarType === 'lands') {
      return !tokens?.length ? (
        <NoLandsSidebarView />
      ) : (
        <ActiveLandsSidebarView />
      );
    }

    return null;
  };

  const hasLands = Boolean(tokens?.length);

  return (
    <LandsSidebarWrapper
      withLands={hasLands}
      isVisible={sidebarType === 'lands' || sidebarType === 'cart'}
      isMobile={isMobile}
    >
      <CartCloseIconWrapper>
        <MarsNavMyLandClose
          onClick={() => {
            dispatch(toggleMyLandPopup(null));
            // Timeout as duration of animation frames
            setTimeout(() => dispatch(toggleCartSidebar(false)), 300);
          }}
        >
          <CloseIcon />
        </MarsNavMyLandClose>
      </CartCloseIconWrapper>
      {getContent()}
    </LandsSidebarWrapper>
  );
};

export const NoLandsSidebarView = () => {
  const { addToast } = useToasts();
  const { isLoadingTokens, tokens } = useBalance();
  const { isHarmonyChains } = useFlags();
  const { isInitialized } = usePersonalInfo();
  const [maxClnyIncome, setMaxClnyIncome] = useState<string | null>(null);

  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const onBuyLandClick = () => {
    if (isHarmonyChains) {
      return window.open(LINKS.harmony.nftKey, '_blank');
    } else {
      addToast('You can buy new lands on the globe', { appearance: 'info' });
    }
  };

  useEffect(() => {
    if (isHarmonyChains) return;
    try {
      (async () => {
        const data = await PolygonBackend.getHeaderStats();
        const stat = data.max ?? 0;
        setMaxClnyIncome(stat);
      })();
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      setIsLocalLoading(false);
    }

    if (Array.isArray(tokens)) {
      setIsLocalLoading(false);
    }
  }, [tokens, isInitialized]);

  return (
    <LandsSidebarHeaderWrapper>
      <NoLandsTitle>
        {isLoadingTokens || isLocalLoading ? (
          'Loading...'
        ) : (
          <>
            You do not <br /> have lands
          </>
        )}
      </NoLandsTitle>
      {(isLoadingTokens || isLocalLoading) && <Loader />}
      {!isLoadingTokens && !isLocalLoading && (
        <>
          <Button onClick={onBuyLandClick} text="Buy land" variant="common" />
          <ButtonSubText>
            {NETWORK_DATA.ECONOMY === 'fixed'
              ? 'Earn up to 14 CLNY/day from a land'
              : `Earn up to ${fromWeiValue(
                  maxClnyIncome ?? '...'
                )} CLNY/day from a land`}
          </ButtonSubText>
        </>
      )}
    </LandsSidebarHeaderWrapper>
  );
};

export const ActiveLandsSidebarView = () => {
  const dispatch = useDispatch();
  const {
    tokens,
    earnedAmount,
    dailySpeed,
    collectAllStats,
    isCollectInProgress,
    clnyBalance,
    isLoadingTokens
  } = useBalance();

  const { address, web3Instance } = usePersonalInfo();
  const { isMissionsAvailable, isRevShareAvailable, isFixedEconomy } =
    useFlags();
  const { personalRevshare, getPersonalRevshare } = useRevshare();
  const { isAccountPrivate, onPrivacyToggleChange, isTogglerPending } =
    useSharing();
  const { currentLandsPage } = useAppParts();
  const { landsMissionsLimits } = useLands(tokens, web3Instance);

  useEffect(() => {
    if (isRevShareAvailable) getPersonalRevshare();
  }, []);

  const title = useMemo(
    () =>
      isLoadingTokens ? 'Loading...' : `Lands: ${tokens?.length ?? '...'}`,
    [tokens, isLoadingTokens]
  );
  const isCollectAvailable = Boolean(tokens?.length) && Boolean(earnedAmount);
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const isLandPaginated = (index: number) =>
    index >= (currentLandsPage - 1) * 10 && index < currentLandsPage * 10;

  const getMissionsLimit = (token: string) =>
    landsMissionsLimits?.[`${token}`] ?? '...';

  const revshareBlock = useMemo(() => {
    if (!isRevShareAvailable || isAccountPrivate) return null;
    return (
      <RevenuButtonWrapper
        onClick={() => dispatch(setRevshareModalState(true))}
      >
        <span>Revenue share</span>
        <span className="counter">
          {`${personalRevshare}${personalRevshare !== '...' ? '%' : ''}`}
        </span>
      </RevenuButtonWrapper>
    );
  }, [personalRevshare, dispatch, isRevShareAvailable, isAccountPrivate]);

  const allTimeStats = useMemo(() => {
    const earned = Boolean(earnedAmount)
      ? `${earnedAmount.toFixed(2)} ${NETWORK_DATA.TOKEN_NAME} earned`
      : GAP_TEXT;

    const speed = () => {
      if (Boolean(dailySpeed)) {
        return isFixedEconomy
          ? getClnySpeedLabel(dailySpeed)
          : `${dailySpeed} ${dailySpeed === 1 ? 'share' : 'shares'}`;
      } else return GAP_TEXT;
    };

    return `${earned} | ${speed()}`;
  }, [earnedAmount, dailySpeed]);

  return (
    <div>
      <LandsSidebarHeaderWrapper isMobile={isMobile}>
        <ActiveLandsFirstLine withRevshare={isRevShareAvailable}>
          <ActiveLandsControlWrapper>
            <ActiveLandsTitle>{title}</ActiveLandsTitle>
            {revshareBlock}
          </ActiveLandsControlWrapper>
          {/* Initial value is null */}
          {isMissionsAvailable && typeof isAccountPrivate !== 'object' && (
            <div className="mt-10">
              <ToggleSwitch
                label="Sharing"
                isDisabled={isTogglerPending}
                value={!isAccountPrivate}
                onChange={onPrivacyToggleChange}
              />
            </div>
          )}
        </ActiveLandsFirstLine>
        {isCollectAvailable && (
          <Button
            disabled={isCollectInProgress}
            onClick={() => collectAllStats(address, web3Instance)}
            text="COLLECT ALL"
            variant="common"
            disabledText="Collecting..."
          />
        )}
        <ButtonSubText withRevshare={isRevShareAvailable}>
          {allTimeStats}
        </ButtonSubText>
      </LandsSidebarHeaderWrapper>
      <LandsBlock>
        {isLoadingTokens && <Loader />}
        {!isLoadingTokens &&
          Array.from(tokens ?? []).map((token, index) => {
            return (
              <div key={`${token}-${index}`}>
                {isLandPaginated(index) && (
                  <LandPlot
                    missionsLimit={getMissionsLimit(token ?? '')}
                    key={`${token}-${index}`}
                    id={parseInt(token ?? '')}
                    CLNYBalance={clnyBalance}
                    trigger={isCollectInProgress}
                  />
                )}
              </div>
            );
          })}
      </LandsBlock>
      {tokens && (
        <LandsPagination currentPage={currentLandsPage} tokens={tokens} />
      )}
    </div>
  );
};

const LandsPagination = ({
  currentPage,
  tokens = []
}: {
  currentPage: number;
  tokens: string[];
}) => {
  const dispatch = useDispatch();
  return (
    <TokensWrapper>
      <FlexedPlotDivider />
      <div className="flex-30">
        {currentPage > 1 && (
          <div
            onClick={() => dispatch(setLandPageNumber(currentPage - 1))}
            className="pointer"
          >
            <ArrowLeft />
          </div>
        )}
      </div>
      <div className="flex-160">
        {(currentPage - 1) * 10 + 1}-
        {Math.min(currentPage * 10, tokens?.length ?? 0)} of{' '}
        {tokens?.length ?? 0}
      </div>
      <div className="flex-30">
        {tokens?.length && currentPage < tokens.length / 10 && (
          <div
            onClick={() => dispatch(setLandPageNumber(currentPage + 1))}
            className="pointer"
          >
            <ArrowRight />
          </div>
        )}
      </div>
      <FlexedPlotDivider />
    </TokensWrapper>
  );
};

const CartList = () => {
  const dispatch = useDispatch();
  const { cartItems } = useAppParts();

  const onMapSearch = (event: any, id: number) => {
    navigateToGlobeLand(event, id);
  };

  const onCartItemRemove = (id: string) => {
    freeReserve(+id).catch(() => {});
    dispatch(deleteItemFromChart(id));
  };

  return (
    <div>
      <CartContent itemsCount={cartItems.length ?? 0} />
      <div>
        {cartItems.map((id, idx) => (
          <LandPlotOuterWrapper key={`${id}-${idx}`}>
            <LandPlotNewImageWrapper>
              <img
                src={generateBlockie(parseInt(id)).toDataURL()}
                alt={'Land Plot #' + id.toString()}
              />
            </LandPlotNewImageWrapper>
            <LandPlotEnhancementsBlock>
              <LandPlotTitleLine>
                <LandPlotNewName>Land #{id}&nbsp;</LandPlotNewName>
              </LandPlotTitleLine>
            </LandPlotEnhancementsBlock>
            <LandPlotNewIconWrapper>
              <div onClick={(e) => onMapSearch(e, parseInt(id))}>
                <LandPinIcon className="with-fill" />
              </div>
            </LandPlotNewIconWrapper>
            <LandPlotNewRemove onClick={() => onCartItemRemove(id)}>
              REMOVE
            </LandPlotNewRemove>
          </LandPlotOuterWrapper>
        ))}
      </div>
    </div>
  );
};
