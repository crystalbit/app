import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import QuestsBackend from '@api/questsBackend';
import { trackUserEvent } from '@global/utils/analytics';
import { formatRequestWrapperPayload } from '@global/utils/gas';
import { txWrapper } from '@global/utils/tx-wrapper';
import { CURRENT_CHAIN } from '@root/settings/chains';
import {
  baseAvailabilitySelector,
  basePlacementSelector,
  isBuildPendingSelector,
  isReplaceModeSelector,
  powerplantAvailabilitySelector,
  powerplantPlacementSelector,
  robotsAvailabilitySelector,
  robotsPlacementSelector,
  transportAvailabilitySelector,
  transportPlacementSelector
} from '@selectors/gameManagerSelectors';
import { tokensSelector } from '@selectors/userStatsSelectors';
import {
  changeGameMode,
  GAME_VIEW_MODES,
  selectObjectToSet,
  setBuildPending,
  setLandInfoPart
} from '@slices/gameManagementSlice';
import { setLandsMissionsLimits } from '@slices/userStatsSlice';
import { CONTRACT_METHODS } from '../types';
import useMetamask from './useMetamask';

const useGameManagement = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const { makeCallRequest } = useMetamask();

  const tokens = useSelector(tokensSelector);
  const isBuildPending = useSelector(isBuildPendingSelector);
  const isGameRepaintMode = useSelector(isReplaceModeSelector);

  const getObjectsCoords = async (tokenId: string) => {
    if (!window.RM || !address) return null;

    return makeCallRequest<{
      base: Record<string, any>;
      robot: Record<string, any>;
      power: Record<string, any>;
      transport: Record<string, any>;
    }>({
      contract: window.RM,
      method: CONTRACT_METHODS.getCoord,
      params: [tokenId],
      address
    });
  };

  const getObjectsAvailability = async (tokenId: string) => {
    if (!window.GM || !address) return null;
    const data = await makeCallRequest<Array<Record<string, string>>>({
      contract: window.GM,
      method: CONTRACT_METHODS.getAttributesMany,
      params: [[tokenId]],
      address
    });

    if (!data) {
      return null;
    }
    const [bs, transport, ra, pp] = [
      data[0]['2'],
      data[0]['3'],
      data[0]['4'],
      data[0]['5']
    ];
    return {
      bs,
      transport,
      ra,
      pp
    };
  };

  const extractCoords = (infoArr: Record<string, any>) => {
    const { x, y } = infoArr;
    return {
      x,
      y
    };
  };

  const buildBasicCall = async (
    tokenId: string,
    objType: string,
    method: string,
    { withBuild, x, y, free, onSuccess, onFail }: Record<string, any>
  ) => {
    const args = withBuild ? [tokenId, x, y] : [tokenId, x, y, free];
    dispatch(setBuildPending(objType));

    const payload = await formatRequestWrapperPayload();

    trackUserEvent(`${free ? 'Move' : 'Place'} ${objType} clicked`);

    txWrapper(window.GM.methods[method](...args).send(payload), {
      addToast,
      eventName: `${!free ? 'Replacing' : 'Placing'} ${objType}`,
      chainData: CURRENT_CHAIN,
      onConfirm: async () => {
        trackUserEvent(`${free ? 'Move' : 'Place'} ${objType} succeed`);

        await collectAllLandInfo(tokenId).then(() => {
          dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
          dispatch(selectObjectToSet(null));
        });

        const limits = await QuestsBackend.getLimits({
          // @ts-ignore
          landIds: tokens,
          avatarIds: []
        });

        dispatch(setLandsMissionsLimits(limits?.lands));
        dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
        await window.updateCLNY?.(window.address);
        await onSuccess();
        dispatch(setBuildPending(''));
      },
      onFail: async () => {
        trackUserEvent(`${free ? 'Move' : 'Place'} ${objType} failed`);

        dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
        await window.updateCLNY?.(window.address);
        onFail();
        dispatch(setBuildPending(''));
      },
      onPending: () => {
        dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
      }
    });
  };

  const collectAllLandInfo = async (tokenId: string) => {
    const availData = await getObjectsAvailability(tokenId);

    if (!availData) {
      return;
    }

    const { bs, transport, ra, pp } = availData;

    const data = await getObjectsCoords(tokenId);

    if (!data) {
      return;
    }

    const {
      base: baseCoords,
      robot: robotCoords,
      power: powerCoords,
      transport: transportCoords
    } = data;

    dispatch(
      setLandInfoPart({
        value: extractCoords(baseCoords),
        availability: bs,
        field: 'base'
      })
    );

    dispatch(
      setLandInfoPart({
        value: extractCoords(transportCoords),
        availability: transport,
        field: 'transport'
      })
    );
    dispatch(
      setLandInfoPart({
        value: extractCoords(robotCoords),
        availability: ra,
        field: 'robot'
      })
    );
    dispatch(
      setLandInfoPart({
        value: extractCoords(powerCoords),
        availability: pp,
        field: 'powerplant'
      })
    );
  };

  const placeBaseObject = async (
    objType: string,
    tokenId: string,
    x: number,
    y: number,
    free: boolean = true,
    onSuccess: () => void,
    onFail: () => void,
    withBuild: boolean
  ) => {
    const method = withBuild ? 'buildAndPlaceBaseStation' : 'placeBaseStation';

    try {
      buildBasicCall(tokenId, objType, method, {
        withBuild,
        x,
        y,
        free,
        onSuccess,
        onFail
      });
    } catch (err) {
      onFail();
      dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
      dispatch(setBuildPending(''));
    }
  };

  const placeTransportObject = async (
    objType: string,
    tokenId: string,
    x: number,
    y: number,
    free: boolean = true,
    onSuccess: () => void,
    onFail: () => void,
    withBuild: boolean
  ) => {
    const method = withBuild ? 'buildAndPlaceTransport' : 'placeTransport';

    try {
      buildBasicCall(tokenId, objType, method, {
        withBuild,
        x,
        y,
        free,
        onSuccess,
        onFail
      });
    } catch (err) {
      onFail();
      dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
      dispatch(setBuildPending(''));
    }
  };

  const placePowerplantObject = async (
    objType: string,
    tokenId: string,
    x: number,
    y: number,
    free: boolean = true,
    onSuccess: () => void,
    onFail: () => void,
    withBuild: boolean
  ) => {
    const method = withBuild
      ? 'buildAndPlacePowerProduction'
      : 'placePowerProduction';

    try {
      buildBasicCall(tokenId, objType, method, {
        withBuild,
        x,
        y,
        free,
        onSuccess,
        onFail
      });
    } catch (err) {
      onFail();
      dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
      dispatch(setBuildPending(''));
    }
  };

  const placeRobotsObject = async (
    objType: string,
    tokenId: string,
    x: number,
    y: number,
    free: boolean = true,
    onSuccess: () => void,
    onFail: () => void,
    withBuild: boolean
  ) => {
    const method = withBuild
      ? 'buildAndPlaceRobotAssembly'
      : 'placeRobotAssembly';

    try {
      buildBasicCall(tokenId, objType, method, {
        withBuild,
        x,
        y,
        free,
        onSuccess,
        onFail
      });
    } catch (err) {
      onFail();
      dispatch(changeGameMode(GAME_VIEW_MODES.navigation));
      dispatch(setBuildPending(''));
    }
  };

  window.placeBaseObject = placeBaseObject;
  window.placePowerplantObject = placePowerplantObject;
  window.placeTransportObject = placeTransportObject;
  window.placeRobotsObject = placeRobotsObject;

  const isBaseAvailable = useSelector(baseAvailabilitySelector);
  const isBasePlaced = useSelector(basePlacementSelector);

  const isTransportAvailable = useSelector(transportAvailabilitySelector);
  const isTransportPlaced = useSelector(transportPlacementSelector);

  const isPowerplantAvailable = useSelector(powerplantAvailabilitySelector);
  const isPowerplantPlaced = useSelector(powerplantPlacementSelector);

  const isRobotAvailable = useSelector(robotsAvailabilitySelector);
  const isRobotPlaced = useSelector(robotsPlacementSelector);

  return {
    collectAllLandInfo,
    placeBaseObject,
    placePowerplantObject,
    placeTransportObject,
    placeRobotsObject,
    isBaseAvailable,
    isBasePlaced,
    isPowerplantPlaced,
    isPowerplantAvailable,
    isTransportAvailable,
    isTransportPlaced,
    isRobotAvailable,
    isRobotPlaced,
    isBuildPending,
    isGameRepaintMode
  };
};

export default useGameManagement;
