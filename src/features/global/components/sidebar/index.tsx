import React, {
  ElementType,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAvatars } from '@avatars/hooks/useAvatars';
import {
  SidebarAvatarWrapper,
  SidebarBackOverlay,
  SidebarItemCounter,
  SidebarItemName,
  SidebarItemsList,
  SidebarItemsListInner,
  SidebarItemWrapper,
  SidebarMobileControl,
  SidebarTitle,
  SidebarWrapper
} from '@global/components/sidebar/sidebar.styles';
import { LINKS } from '@global/constants';
import useAppParts from '@global/hooks/useAppParts';
import useFlags from '@global/hooks/useFlags';
import useOutsideClick from '@global/hooks/useOutsideClick';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import useNavigationRoutes from '@global/hooks/useRoutes';
import { LIGHT_GREY, TOXIC_GREEN, WHITE } from '@global/styles/variables';
import { SIDEBAR_ROUTES_NAMES } from '@global/types';
import { trackUserEvent } from '@global/utils/analytics';
import { CloseIcon } from '@images/icons/CloseIcon';
import { DexIcon } from '@images/icons/sidebarIcons/DexIcon';
import { GovernanceIcon } from '@images/icons/sidebarIcons/GovernanceIcon';
import { HomeIcon } from '@images/icons/sidebarIcons/HomeIcon';
import { LandsIcon } from '@images/icons/sidebarIcons/LandsIcon';
import { MarketIcon } from '@images/icons/sidebarIcons/MarketIcon';
import { PlayIcon } from '@images/icons/sidebarIcons/PlayIcon';
import { ProfileIcons } from '@images/icons/sidebarIcons/ProfileIcons';
import { ReferralIcon } from '@images/icons/sidebarIcons/ReferralIcon';
import { SidebarOpenIcon } from '@images/icons/sidebarIcons/SidebarOpenIcon';
import { landsMissionsLimitsSelector } from '@selectors/userStatsSelectors';
import { toggleMyLandPopup } from '@slices/appPartsSlice';

type SideBarItemType = {
  route: string;
  isActive: boolean;
  icon: ElementType;
  withCounter: boolean;
  count: number;
  name: string;
  onClick?: () => void;
  address: string;
  trackEvent?: string;
};

const SideBarItem = ({
  route,
  isActive,
  icon: Icon,
  withCounter,
  count,
  name,
  onClick,
  trackEvent
}: SideBarItemType) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = usePersonalInfo();

  const isCurrentRoute = useMemo(() => {
    if (location.pathname === '/' && route === '/') return true;
    if (route !== '/' && location.pathname.includes(route)) return true;
  }, [route, location]);

  const fillColor = useMemo(() => {
    let fill = WHITE;
    if (isCurrentRoute) fill = TOXIC_GREEN;
    if (!isActive) fill = LIGHT_GREY;
    return fill;
  }, [isCurrentRoute, isActive]);

  const title = useMemo(() => {
    if (isActive) return name;
    return (
      <>
        {name}
        <br />
        (soon)
      </>
    );
  }, [isActive, name]);

  const onItemClick = () => {
    if (trackEvent) trackUserEvent(trackEvent);
    if (!isActive) return;
    if (typeof onClick === 'function') onClick();
    else navigate(route);
  };

  const isCounterShown = withCounter && isActive && address;

  return (
    <SidebarItemWrapper isCurrentRoute={isCurrentRoute} onClick={onItemClick}>
      <Icon fill={fillColor} />
      <SidebarItemName disabled={!isActive}>{title}</SidebarItemName>
      {isCounterShown && (
        <SidebarItemCounter disabled={count <= 0}>{count}</SidebarItemCounter>
      )}
    </SidebarItemWrapper>
  );
};

const Sidebar = ({ isMobile }: { isMobile: boolean }) => {
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {
    isMissionsAvailable,
    isChangePageAvailable,
    isRefPageAvailable,
    isPlaySection,
    isHarmonyChains
  } = useFlags();
  const { address } = usePersonalInfo();
  const { isLandsPage, isGamePage } = useNavigationRoutes();
  const { isLandsSidebarOpened } = useAppParts();
  const { selectedAvatar, generateAvatarUrl } = useAvatars();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const landsMissionsLimits = useSelector(landsMissionsLimitsSelector);

  const availableMissionsCount = useMemo(
    () =>
      landsMissionsLimits
        ? Object.values(landsMissionsLimits ?? {}).reduce((acc = 0, i: any) => {
            return acc + i.limits + i.limits2;
          }, 0)
        : '...',
    [landsMissionsLimits]
  );

  const availableRoutes = useMemo(() => {
    return [
      {
        route: '/',
        icon: HomeIcon,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.home,
        trackEvent: 'Home page clicked'
      },
      {
        route: '/profile/',
        onClick: () => {
          return navigate('/profile/0');
        },
        icon: ProfileIcons,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.profile
      },
      {
        route: '/lands',
        onClick: () => {
          if (!isLandsPage) {
            dispatch(toggleMyLandPopup('lands'));
            return navigate('/lands');
          }
          dispatch(toggleMyLandPopup('lands'));
          setIsOpen(false);
        },
        icon: LandsIcon,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.lands,
        trackEvent: 'Lands page clicked'
      },
      {
        route: '/play/',
        onClick: () => {
          return navigate('/play/0');
        },
        icon: PlayIcon,
        isActive: isPlaySection,
        withCounter: isMissionsAvailable,
        count: availableMissionsCount as number,
        name: SIDEBAR_ROUTES_NAMES.play,
        trackEvent: 'Play page clicked'
      },
      {
        route: '/xchange',
        icon: DexIcon,
        isActive: isChangePageAvailable,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.dex,
        trackEvent: 'DEX page clicked (harmony only)'
      },
      {
        route: '/governance',
        icon: GovernanceIcon,
        isActive: true,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.governance,
        onClick: () => {
          if (isHarmonyChains) {
            window.open(LINKS.harmony.governance, '_blank');
          } else {
            window.open(LINKS.polygon.governance, '_blank');
          }
        },
        trackEvent: 'Governance page clicked'
      },
      {
        route: '/referral',
        icon: ReferralIcon,
        isActive: isRefPageAvailable,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.referral,
        trackEvent: 'Referral page clicked'
      },
      {
        route: '/market',
        icon: MarketIcon,
        isActive: false,
        withCounter: false,
        count: 0,
        name: SIDEBAR_ROUTES_NAMES.market,
        trackEvent: 'Market page clicked'
      }
    ];
  }, [
    isHarmonyChains,
    availableMissionsCount,
    address,
    isMissionsAvailable,
    isChangePageAvailable,
    isRefPageAvailable,
    isLandsSidebarOpened,
    location.pathname
  ]);

  const isHidden = !isOpen && isMobile;
  const isMobileOverlay = isOpen && isMobile;

  useOutsideClick(sidebarRef, () => {
    if (isMobileOverlay) {
      setIsOpen(false);
    }
  });

  if (isGamePage) return null;

  return (
    <>
      {isHidden && (
        <SidebarMobileControl>
          <SidebarTitle>MarsColony</SidebarTitle>
          <SidebarOpenIcon onClick={() => setIsOpen(!isOpen)} />
        </SidebarMobileControl>
      )}
      {isMobileOverlay && <SidebarBackOverlay />}
      <SidebarWrapper isHidden={isHidden} ref={sidebarRef}>
        <SidebarTitle>
          MarsColony
          {isMobile && <CloseIcon onClick={() => setIsOpen(false)} />}
        </SidebarTitle>
        <SidebarItemsList>
          <SidebarItemsListInner>
            {availableRoutes.map(
              (
                {
                  route,
                  isActive,
                  icon,
                  count,
                  name,
                  withCounter,
                  onClick,
                  trackEvent
                },
                idx
              ) => (
                <SideBarItem
                  key={`${route}-${idx}`}
                  icon={icon}
                  isActive={isActive}
                  route={route}
                  count={count}
                  name={name}
                  onClick={onClick}
                  withCounter={withCounter}
                  address={address}
                />
              )
            )}
            {selectedAvatar && (
              <SidebarAvatarWrapper
                url={generateAvatarUrl(selectedAvatar)}
                onClick={() => {
                  const id = 1;
                  navigate(`/play/${id}`);
                }}
              />
            )}
          </SidebarItemsListInner>
        </SidebarItemsList>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
