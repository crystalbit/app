import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import DataProvider from '@features/globus/hocs/dataProvider';
import useFlags from '@global/hooks/useFlags';
import GamePage from '@pages/GamePage';
import MapPage from '@pages/MapPage';
import MiningMission from '@pages/MiningMissionPage';
import { QuestsPage } from '@pages/Quests';
import { ReferralPage } from '@pages/ReferralPage';
import WelcomePage from '@pages/WelcomePage';
import XChange from '@pages/XChange';
import { PlayPage } from '@root/pages/PlayPage';
import { ProfilePage } from '@root/pages/ProfilePage';
import ROUTES from '@root/router/routes';

const generateRoutes = (flags: Record<string, boolean>) => {
  const routes = [
    { route: ROUTES.root, element: <MapPage /> },
    { route: ROUTES.lands, element: <MapPage /> },
    { route: ROUTES.mining, element: <MiningMission /> }
  ];

  if (flags.profile) {
    routes.push({ route: ROUTES.profile, element: <ProfilePage /> });
  }

  if (flags.game) {
    routes.push({ route: ROUTES.game, element: <GamePage /> });
  }

  if (flags.play) {
    routes.push({ route: ROUTES.play, element: <PlayPage /> });
  }

  if (flags.missions) {
    routes.push({ route: ROUTES.missions, element: <QuestsPage /> });
  }

  if (flags.avatars) {
    routes.push({ route: ROUTES.martian, element: <h1>Coming Soon...</h1> });
  }

  if (flags.changePage) {
    routes.push({ route: ROUTES.xchange, element: <XChange /> });
  }

  if (flags.referralPage) {
    routes.push({ route: ROUTES.referral, element: <ReferralPage /> });
  }

  return routes.map(({ element, route }) => (
    <Route
      path={route}
      element={<DataProvider>{element}</DataProvider>}
      key={route}
    />
  ));
};

export const AppRouter = () => {
  const {
    isGameFunctionality: game,
    isMissionsAvailable: missions,
    isAvatarsAvailable: avatars,
    isChangePageAvailable: changePage,
    isRefPageAvailable: referralPage,
    isPlaySection: play,
    isProfile: profile
  } = useFlags();

  return (
    <Router>
      <Routes>
        {generateRoutes({
          game,
          missions,
          avatars,
          changePage,
          referralPage,
          play,
          profile
        })}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
