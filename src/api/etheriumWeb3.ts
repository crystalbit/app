import CLNY from '@root/contracts/CLNY.json';
import AM from '@root/contracts/CollectionsManager.json';
import ColonyChef from '@root/contracts/ColonyChef.json';
import CH from '@root/contracts/CryoManager.json';
import GM from '@root/contracts/GameManager.json';
import GEARS from '@root/contracts/Gears.json';
import LB from '@root/contracts/Lootboxes.json';
import LPStats from '@root/contracts/LPStats.json';
import MC from '@root/contracts/MC.json';
import MM from '@root/contracts/MissionsManager.json';
import ORACLE from '@root/contracts/Oracle.json';
import RM from '@root/contracts/ReplaceABI.json';
import { NETWORK_DATA } from '@root/settings';
import { AbiItem } from 'web3-utils';

class Ethereum {
  static getMC = () => {
    return (window.MC =
      window.MC ||
      new window.xweb3!.eth.Contract(MC as AbiItem[], NETWORK_DATA.MC));
  };

  static getCLNYManager = () => {
    return (window.CLNY =
      window.CLNY ||
      new window.xweb3!.eth.Contract(CLNY as AbiItem[], NETWORK_DATA.CLNY));
  };

  static getGameManager = () => {
    return (window.GM =
      window.GM ||
      new window.xweb3!.eth.Contract(GM as AbiItem[], NETWORK_DATA.GM));
  };

  static getReplaceManager = () => {
    return (window.RM =
      window.RM ||
      new window.xweb3!.eth.Contract(RM as AbiItem[], NETWORK_DATA.REPLACE));
  };

  static getCryoChambersManager = () => {
    return (window.CH =
      window.CH ||
      new window.xweb3!.eth.Contract(CH as AbiItem[], NETWORK_DATA.CH));
  };

  static getAvatarsManager = () => {
    return (window.AM =
      window.AM ||
      new window.xweb3!.eth.Contract(AM as AbiItem[], NETWORK_DATA.AM));
  };

  static getLootboxesManager = () => {
    return (window.LB =
      window.LB ||
      new window.xweb3!.eth.Contract(LB as AbiItem[], NETWORK_DATA.LB));
  };

  static getMissionsManager = () => {
    return (window.MM =
      window.MM ||
      new window.xweb3!.eth.Contract(MM as AbiItem[], NETWORK_DATA.MM));
  };

  static getGears = () => {
    return (window.GEARS =
      window.GEARS ||
      new window.xweb3!.eth.Contract(GEARS as AbiItem[], NETWORK_DATA.GEARS));
  };

  static getOracle = () => {
    return (window.ORACLE =
      window.ORACLE ||
      new window.xweb3!.eth.Contract(ORACLE as AbiItem[], NETWORK_DATA.ORACLE));
  };

  static getLM = (index: number) => {
    window.LM = window.LM ?? [];
    return (window.LM[index] =
      window.LM[index] ||
      new window.xweb3!.eth.Contract(
        ColonyChef as AbiItem[],
        NETWORK_DATA.MINING_POOLS[index].contract
      ));
  };

  static getSLP = (index: number) => {
    window.SLP = window.SLP ?? [];
    return (window.SLP[index] =
      window.SLP[index] ||
      new window.xweb3!.eth.Contract(
        CLNY as AbiItem[],
        NETWORK_DATA.MINING_POOLS[index].lpTokenContract
      ));
  };

  static getLPStats = (index: number) => {
    window.LPStats = window.LPStats ?? [];
    return (window.LPStats[index] =
      window.LPStats[index] ||
      new window.xweb3!.eth.Contract(
        LPStats as AbiItem[],
        NETWORK_DATA.MINING_POOLS[index].statsContract
      ));
  };

  static getEthSignature = async (
    message: string,
    address = window.address
  ) => {
    if (!window.xweb3 || !address) return;
    try {
      return await window.xweb3.eth.personal.sign(message, address);
    } catch (err) {
      return err;
    }
  };

  static getTokens = async (): Promise<string[]> => {
    if (NETWORK_DATA.SOLDOUT) {
      return new Array(21000).fill('').map((item, index) => index.toString());
    }
    try {
      const response = await fetch(NETWORK_DATA.LAND_META);
      const result = (await response.json()) as string[];
      return result.map((o) => `${o}`);
    } catch (err) {
      return [];
    }
  };

  static getPolygonGasValue = async () => {
    const response = await fetch(
      'https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata'
    );
    const data = await response.json();
    return data.result;
  };
}

export default Ethereum;
