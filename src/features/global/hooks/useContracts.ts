import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '@redux/selectors/commonAppSelectors';
import {
  setAvatarManager,
  setCLNYManager,
  setCryoManager,
  setGameManager,
  setGears,
  setlLiquidityMiningManager,
  setLootboxesManager,
  setMCManager,
  setMissionsManager,
  setOracle,
  setReplaceManager,
  setSLPManager
} from '@redux/slices/commonAppStateSlice';
import Ethereum from '@root/api/etheriumWeb3';

const {
  lmManagerSelector,
  clnyManagerSelector,
  avatarsManagerSelector,
  lootboxesManagerSelector,
  replaceManagerSelector,
  missionsManagerSelector,
  mcManagerSelector,
  userGameManagerSelector,
  slpManagerSelector,
  cryoManagerSelector,
  gearsSelector,
  oracleSelector
} = selectors;

const useContracts = () => {
  const dispatch = useDispatch();

  const gameManager = useSelector(userGameManagerSelector) ?? window.GM;
  const cryoManager = useSelector(cryoManagerSelector) ?? window.CH;
  const avatarsManager = useSelector(avatarsManagerSelector) ?? window.AM;
  const replaceManager = useSelector(replaceManagerSelector) ?? window.RM;
  const missionsManager = useSelector(missionsManagerSelector) ?? window.MM;
  const lootboxesManager = useSelector(lootboxesManagerSelector) ?? window.LM;
  const mcManager = useSelector(mcManagerSelector) ?? window.MCM;
  const clnyManager = useSelector(clnyManagerSelector) ?? window.CLNYM;
  const liquidityMiningManager = useSelector(lmManagerSelector) ?? window.LMM;
  const slpManager = useSelector(slpManagerSelector) ?? window.SLPM;
  const gears = useSelector(gearsSelector) ?? window.GEARS;
  const oracle = useSelector(oracleSelector) ?? window.ORACLE;

  const initializeContracts = () => {
    getGameManager();
    getAvatarsManager();
    getReplaceManager();
    getMissionsManager();
    getLootboxesManager();
    getCryoChambersManager();
    getGears();
    getOracle();
  };

  const getMCManager = React.useCallback(() => {
    const mc = Ethereum.getMC();
    dispatch(setMCManager(mc));
    return mc;
  }, []);

  const getCLNYManager = React.useCallback(() => {
    const clny = Ethereum.getCLNYManager();
    dispatch(setCLNYManager(clny));
    return clny;
  }, []);

  const getLMManager = React.useCallback((index: number) => {
    const lm = Ethereum.getLM(index);
    dispatch(setlLiquidityMiningManager(lm));
    return lm;
  }, []);

  const getSLPManager = React.useCallback((index: number) => {
    const slp = Ethereum.getSLP(index);
    dispatch(setSLPManager(slp));
    return slp;
  }, []);

  const getGameManager = React.useCallback(() => {
    const gm = Ethereum.getGameManager();
    dispatch(setGameManager(gm));
    return gm;
  }, [dispatch]);

  const getAvatarsManager = React.useCallback(() => {
    const am = Ethereum.getAvatarsManager();
    dispatch(setAvatarManager(am));
    return am;
  }, [dispatch]);

  const getReplaceManager = React.useCallback(() => {
    const rm = Ethereum.getReplaceManager();
    dispatch(setReplaceManager(rm));
    return rm;
  }, [dispatch]);

  const getMissionsManager = React.useCallback(() => {
    const mm = Ethereum.getMissionsManager();
    dispatch(setMissionsManager(mm));
    return mm;
  }, [dispatch]);

  const getLootboxesManager = React.useCallback(() => {
    const lb = Ethereum.getLootboxesManager();
    dispatch(setLootboxesManager(lb));
    return lb;
  }, [dispatch]);

  const getCryoChambersManager = React.useCallback(() => {
    const ch = Ethereum.getCryoChambersManager();
    dispatch(setCryoManager(ch));
    return ch;
  }, [dispatch]);

  const getGears = React.useCallback(() => {
    const gears = Ethereum.getGears();
    dispatch(setGears(gears));
    return gears;
  }, [dispatch]);

  const getOracle = React.useCallback(() => {
    const oracle = Ethereum.getOracle();
    dispatch(setOracle(oracle));
    return oracle;
  }, [dispatch]);

  return {
    initializeContracts,
    gameManager,
    avatarsManager,
    clnyManager,
    mcManager,
    cryoManager,
    liquidityMiningManager,
    lootboxesManager,
    replaceManager,
    missionsManager,
    slpManager,
    getCLNYManager,
    getGameManager,
    getMCManager,
    getLMManager,
    getSLPManager,
    getLootboxesManager,
    getMissionsManager,
    getCryoChambersManager,
    getGears,
    gears,
    oracle,
    getOracle,
    getAvatarsManager
  };
};

export default useContracts;
