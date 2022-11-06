import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { KEY_OBJECTS } from '@features/game/constants/gameObjects';
import {
  LAND_STATS_CHECK_TICK,
  SPEED_STAT_CHECK_TICK
} from '@global/constants';
import { useBalance } from '@global/hooks/useBalance';
import useContracts from '@global/hooks/useContracts';
import useFlags from '@global/hooks/useFlags';
import useGameManagement from '@global/hooks/useGameManagement';
import useMetamask from '@global/hooks/useMetamask';
import usePersonalInfo from '@global/hooks/usePersonalInfo';
import useRoutes from '@global/hooks/useRoutes';
import { CONTRACT_METHODS, METAMASK_EVENTS } from '@global/types';
import { trackUserEvent } from '@global/utils/analytics';
import { setRepaintMode } from '@slices/gameManagementSlice';

const useLandStats = (isCartItem: boolean = false, id?: number) => {
  // Facilities levels
  const [hasBaseStation, setHasBaseStation] = React.useState<boolean | null>(
    null
  );
  const [transportLevel, setTransportLevel] = React.useState<number>(0);
  const [robotAssemblyLevel, setRobotAssemblyLevel] = React.useState<number>(0);
  const [powerProductionLevel, setPowerProductionLevel] =
    React.useState<number>(0);

  // Meta stats
  const lastFetchedBalance = React.useRef<string>();
  const softTimer = React.useRef<NodeJS.Timeout>();
  const [isInitialLoad, setInitialLoad] = React.useState<boolean>(true);
  const [earned, setEarned] = React.useState<string>('...');
  const [earningSpeed, setEarningSpeed] = React.useState<number | string>(
    '...'
  );
  const [isBuyProcess, setIsBuyProcess] = React.useState<string>('');

  // Utils
  const dispatch = useDispatch();
  const { makeRequest } = useMetamask();
  const { address, provider } = usePersonalInfo();
  const { gameManager, getGameManager } = useContracts();
  const { isFixedEconomy } = useFlags();
  const { isGamePage } = useRoutes();
  const { collectAllLandInfo } = useGameManagement();
  const { updateEarnedAll, updateCLNYBalance } = useBalance();

  const updateEarned = useCallback(
    async (callback?: () => void) => {
      if (isCartItem || !provider) return;

      await makeRequest({
        address,
        type: METAMASK_EVENTS.call,
        method: CONTRACT_METHODS.getEarned,
        params: [id],
        errorText: 'getEarned error',
        contract: gameManager ?? getGameManager(),
        onSuccess: (balance: number) => {
          if (balance !== undefined) {
            if (
              lastFetchedBalance.current !== (balance * 10 ** -18).toFixed(4)
            ) {
              lastFetchedBalance.current = (balance * 10 ** -18).toFixed(4);
              setEarned((balance * 10 ** -18).toFixed(4));
            }
          }
        }
      });

      await makeRequest({
        address,
        type: METAMASK_EVENTS.call,
        method: CONTRACT_METHODS.getAttributesMany,
        params: [[id]],
        errorText: 'getAttributesMany error',
        contract: gameManager ?? getGameManager(),
        onSuccess: (data: Record<string, string>[]) => {
          callback?.();
          if (data) {
            const [bs, transport, ra, pp] = [
              data[0]['2'],
              data[0]['3'],
              data[0]['4'],
              data[0]['5']
            ];
            setHasBaseStation(!!parseInt(bs));
            setTransportLevel(parseInt(transport));
            setRobotAssemblyLevel(parseInt(ra));
            setPowerProductionLevel(parseInt(pp));
          }
        },
        onError: () => {
          callback?.();
        }
      });

      await makeRequest({
        address,
        type: METAMASK_EVENTS.call,
        method: CONTRACT_METHODS.getEarningSpeed,
        params: [id],
        errorText: 'getEarningSpeed error',
        contract: gameManager ?? getGameManager(),
        onSuccess: (result: string) => {
          if (result !== undefined) {
            setEarningSpeed(parseInt(result));
          }
        },
        onError: () => {}
      });
    },
    [address, isCartItem, id, provider]
  );

  const buildAction = async (method: string, type: string, level?: number) => {
    if (!isGamePage) setIsBuyProcess(type);
    trackUserEvent(`Upgrade ${type} clicked`, {
      level: level ?? 'no level provided'
    });
    await makeRequest({
      contract: gameManager ?? getGameManager(),
      method,
      params: level !== undefined ? [id, level] : [id],
      type: METAMASK_EVENTS.send,
      address,
      eventName: `Build ${type} on Land Plot #${id}`,
      onError: () => {
        trackUserEvent(`Upgrade ${type} failed`, {
          level: level ?? 'no level provided',
          landId: id
        });

        if (!isGamePage) setIsBuyProcess('');
      },
      onSuccess: async () => {
        trackUserEvent(`Upgrade ${type} succeed`, {
          level: level ?? 'no level provided',
          landId: id
        });

        try {
          await collectAllLandInfo(`${id}`);
          dispatch(setRepaintMode(true));
          if (!isGamePage) setIsBuyProcess('');
          await updateCLNYBalance(address);
          await updateEarnedAll();
          await updateEarned();
        } catch (err) {}
      }
    });
  };

  const buildBaseStation = async () => {
    await buildAction(CONTRACT_METHODS.buildBaseStation, KEY_OBJECTS.base);
  };

  const upgradeTransport = async (level: number) => {
    await buildAction(
      CONTRACT_METHODS.upgradeTransport,
      KEY_OBJECTS.transport,
      level
    );
  };

  const upgradeRobotAssembly = async (level: number) => {
    await buildAction(
      CONTRACT_METHODS.upgradeRobotAssembly,
      KEY_OBJECTS.robot,
      level
    );
  };

  const upgradePowerProduction = async (level: number) => {
    await buildAction(
      CONTRACT_METHODS.upgradePowerProduction,
      KEY_OBJECTS.power,
      level
    );
  };

  React.useEffect(() => {
    if (isCartItem) return;

    updateEarned(() => setInitialLoad(false)).then(() => {});

    const balanceChecker = setInterval(async () => {
      await updateEarned();
    }, LAND_STATS_CHECK_TICK);

    return () => {
      clearInterval(balanceChecker);
    };
  }, [updateEarned, isCartItem]);

  React.useEffect(() => {
    if (earningSpeed === 0 || typeof earningSpeed === 'string' || isCartItem)
      return;
    if (softTimer.current) clearInterval(softTimer.current);

    if (isFixedEconomy) {
      softTimer.current = setInterval(() => {
        if (parseFloat(earned) > 0) {
          // 0 means that CLNY minting is probably stopped
          setEarned((earned) => (+earned + 0.0001).toFixed(4));
        }
      }, SPEED_STAT_CHECK_TICK / earningSpeed);
    }
    return () => {
      if (softTimer.current) clearInterval(softTimer.current);
    };
  }, [earned, earningSpeed, isCartItem]);

  return {
    transportLevel,
    powerProductionLevel,
    robotAssemblyLevel,
    hasBaseStation,
    isInitialLoad,
    isBuyProcess,
    earned,
    earningSpeed,
    lastFetchedBalance,
    build: {
      base: buildBaseStation,
      robots: upgradeRobotAssembly,
      power: upgradePowerProduction,
      transport: upgradeTransport
    },
    updateEarned
  };
};
export default useLandStats;
