import { useLocation, useNavigate } from 'react-router-dom';

const useNavigationRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isProfilePage = location.pathname.includes('/profile');
  const isLandsPage = location.pathname.includes('/lands');
  const isGamePage = location.pathname.includes('/game');
  const isPlayPage = location.pathname.includes('/play');
  const isMissionsPage = location.pathname.includes('/missions');
  const isWelcomePage = location.pathname.includes('/');
  const isFarmingPage = location.pathname === '/space-xchange';
  const isQuestPage = location.pathname.includes('/missions');
  const isRefPage = location.pathname.includes('/referral');
  const isMiningPage = location.pathname.includes('/mining');

  window.navigateHook = navigate;

  return {
    isProfilePage,
    isLandsPage,
    isGamePage,
    isPlayPage,
    isMissionsPage,
    isWelcomePage,
    isRefPage,
    isQuestPage,
    isMiningPage,
    isFarmingPage
  };
};

export default useNavigationRoutes;
