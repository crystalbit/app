import Ethereum from '@api/etheriumWeb3';
import { getDefaultPostPayload } from '@global/utils/fetch';
import { signatureToVrs } from '@global/utils/signatureToVrs';
import { getMiningSignMessage } from '@global/utils/signs';
import { txWrapper } from '@global/utils/tx-wrapper';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN } from '@root/settings/chains';
import mixpanel from 'mixpanel-browser';

export type StartRouteResponseType = {
  position: { x: number; y: number };
  moves: number;
  dynamites: number;
  scans: number;
  tiles: [{ x: number; y: number; state: number }];
  resources: {
    common: number;
    rare: number;
    legendary: number;
  };
  fightStatus: 'fail' | 'win';
  worm: boolean;
  data: {
    name: string;
    value: string;
    type: string;
  }[];
};

type CommonMiningAPIPayloadType = {
  address: string;
  signature: string;
};

type CommonSignaturePayloadType = {
  landId: string;
  avatarId: string;
  transportId: string;
  missionId: string;
  address?: string;
};

class MiningQuestApi {
  private static BASE_URL: string = NETWORK_DATA.BACKEND + '/missions/2';
  private static ROUTES: Record<
    | 'start'
    | 'move'
    | 'mine'
    | 'fuel'
    | 'scan'
    | 'exit'
    | 'wormAction'
    | 'dynamite',
    string
  > = {
    start: this.BASE_URL + '/start',
    move: this.BASE_URL + '/move',
    mine: this.BASE_URL + '/mine',
    fuel: this.BASE_URL + '/fuel',
    scan: this.BASE_URL + '/scan',
    exit: this.BASE_URL + '/exit',
    wormAction: this.BASE_URL + '/wormAction',
    dynamite: this.BASE_URL + '/dynamite'
  };
  private static signature: string | undefined;
  private static signatureMessageKey: string | undefined;
  private static getActiveSignature = () =>
    localStorage.getItem('activeSignature');
  private static landId: number | string = -1;
  private static avatarId: number | string = -1;

  private static saveLocalStorage = (signature: string, data: string) => {
    localStorage.setItem(
      'activeSignature',
      JSON.stringify({
        activeSignatureTime: {
          date: new Date().toLocaleString().split(', ')[0],
          time: new Date().toLocaleString().split(', ')[1],
          signature,
          dataSignMsg: data
        }
      })
    );
  };

  private static timeDiffCalc = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;

    return { days, hours, minutes };
  };

  private static setDifTime = (landId: string, avatarId: string) => {
    if (!landId || !avatarId) return { flag: null };

    if (this.getActiveSignature() === null) {
      return { flag: true };
    } else {
      // @ts-ignore
      const checkDifferentTime = JSON.parse(this.getActiveSignature());
      const { date, time, signature, dataSignMsg } =
        checkDifferentTime.activeSignatureTime;
      const nowDate: string =
        new Date()
          .toLocaleString()
          .split(', ')[0]
          .split('.')
          .reverse()
          .join('.') + `, ${new Date().toLocaleString().split(', ')[1]}`;
      const dateFeature: string = `${date
        .split('.')
        .reverse()
        .join('.')}, ${time}`;
      const { days, hours, minutes } = this.timeDiffCalc(
        new Date(dateFeature),
        new Date(nowDate)
      );

      if (days > 0) {
        return { flag: true };
      } else if (hours < 23 && hours === 0) {
        return { flag: false, signature, data: dataSignMsg };
      } else if (minutes < 55) {
        return { flag: false, signature, data: dataSignMsg };
      } else {
        return { flag: true, signature, data: dataSignMsg };
      }
    }
  };

  static getInitialSignature = async ({
    landId,
    avatarId
  }: CommonSignaturePayloadType) => {
    const signatureFlag = this.setDifTime(landId, avatarId);
    if (signatureFlag.flag) {
      const messageKey = getMiningSignMessage(landId, avatarId);

      if (!messageKey) return;

      try {
        const signature = await Ethereum.getEthSignature(messageKey);
        if (typeof signature === 'string') {
          console.log('SAVING');

          this.saveLocalStorage(signature, messageKey);
          return {
            signature,
            messageKey
          };
        }
        return;
      } catch (err: any) {
        return window.toast(err.message, {
          appearance: 'error'
        });
      }
    } else if (signatureFlag.flag === null) {
      mixpanel.track('Mining mission signature not received', {
        address
      });
    } else {
      mixpanel.track('Mining mission signature received', { address });
      if (this.getActiveSignature() !== null) {
        // @ts-ignore
        const _activeSignature = JSON.parse(this.getActiveSignature());
        return {
          signature: _activeSignature.activeSignatureTime.signature,
          messageKey: _activeSignature.activeSignatureTime.dataSignMsg
        };
      }
    }
  };

  static start = async ({
    missionId = '2',
    address,
    transportId,
    landId,
    avatarId,
    callback
  }: { callback?: () => void } & Partial<CommonMiningAPIPayloadType> &
    CommonSignaturePayloadType): Promise<Partial<StartRouteResponseType> | void> => {
    this.landId = landId;
    this.avatarId = avatarId;
    try {
      const signatureData = await this.getInitialSignature({
        landId,
        avatarId,
        transportId,
        missionId,
        address
      });

      if (!signatureData) {
        callback?.();
        return window.toast('Mining mission: start cancel', {
          appearance: 'error'
        });
      }
      const { signature, messageKey } = signatureData;
      this.signature = signature;
      this.signatureMessageKey = messageKey;

      const response = await fetch(
        MiningQuestApi.ROUTES.start,
        getDefaultPostPayload({
          address,
          message: messageKey,
          signature,
          avatarId,
          landId,
          missionId
        })
      );

      const data = await response.json();

      if (!response.ok) {
        callback?.();
        return window.toast(data?.message ?? 'Mining mission: start failed', {
          appearance: 'error'
        });
      }
      return data;
    } catch (err: any) {
      callback?.();
      return window.toast(err.message, {
        appearance: 'error'
      });
    }
  };

  static exit = async ({
    missionId = '2',
    address,
    successCallback,
    failCallback
  }: {
    missionId: string;
    address: string;
    failCallback?: () => void;
    successCallback?: (result: Partial<StartRouteResponseType>) => void;
  }) => {
    if (!address) return;
    return this.ApiHandler({
      failMessage: 'Mining mission: exit failed',
      route: MiningQuestApi.ROUTES.exit,
      address,
      successCallback,
      failCallback,
      missionId
    });
  };

  static move = async ({
    missionId = '2',
    address,
    direction,
    failCallback
  }: {
    missionId: string;
    landId: number;
    avatarId: number;
    direction: 'left' | 'right' | 'top' | 'bottom';
    address: string;
    failCallback?: () => void;
  }): Promise<Partial<StartRouteResponseType> | void> => {
    if (!address) return;
    return this.ApiHandler({
      failMessage: 'Mining mission: transport move failed',
      route: MiningQuestApi.ROUTES.move,
      address,
      additionalPayload: { direction },
      failCallback,
      missionId
    });
  };

  static mine = async ({
    missionId = '2',
    address,
    successCallback,
    failCallback
  }: {
    missionId: string;
    address: string;
    failCallback?: (err?: any) => void;
    successCallback?: (result: Partial<StartRouteResponseType>) => void;
  }): Promise<Partial<StartRouteResponseType> | void> => {
    if (!address) return;
    return this.ApiHandler({
      failMessage: 'Mining mission: mine failed',
      route: MiningQuestApi.ROUTES.mine,
      address,
      failCallback,
      successCallback,
      missionId
    });
  };

  static fuel = async ({
    missionId = '2',
    address,
    successCallback,
    failCallback
  }: {
    missionId: string;
    address: string;
    failCallback?: () => void;
    successCallback?: (result: Partial<StartRouteResponseType>) => void;
  }): Promise<Partial<StartRouteResponseType> | void> => {
    if (!address) return;
    return this.ApiHandler({
      failMessage: 'Mining mission: fuel collect failed',
      successCallback,
      failCallback,
      route: MiningQuestApi.ROUTES.fuel,
      address,
      missionId
    });
  };

  static dynamite = async ({
    missionId = '2',
    address,
    successCallback,
    failCallback
  }: {
    missionId: string;
    address: string;
    failCallback: () => void;
    successCallback: () => void;
  }) => {
    if (!address) return;
    return this.ApiHandler({
      failMessage: 'Mining mission: dynamite set failed',
      route: MiningQuestApi.ROUTES.dynamite,
      address,
      successCallback,
      failCallback,
      missionId
    });
  };

  static scan = async ({
    missionId = '2',
    address,
    failCallback,
    successCallback
  }: {
    missionId: string;
    landId: number;
    avatarId: number;
    address: string;
    failCallback: () => void;
    successCallback: () => void;
  }): Promise<Partial<StartRouteResponseType> | void> => {
    if (!address) return;
    return this.ApiHandler({
      failMessage: 'Mining mission: scan failed',
      route: MiningQuestApi.ROUTES.scan,
      address,
      failCallback,
      successCallback,
      missionId
    });
  };

  static wormAction = async ({
    missionId = '2',
    address,
    action,
    failCallback,
    successCallback
  }: {
    missionId: string;
    landId: number;
    avatarId: number;
    address: string;
    action: 'retreat' | 'pay' | 'fight';
    failCallback: () => void;
    successCallback: () => void;
  }): Promise<Partial<StartRouteResponseType> | void> => {
    return this.ApiHandler({
      failMessage: 'Mining mission: worm action failed',
      route: MiningQuestApi.ROUTES.wormAction,
      address,
      additionalPayload: { action },
      failCallback,
      successCallback,
      missionId
    });
  };

  static ApiHandler = async ({
    route,
    failMessage,
    address,
    additionalPayload,
    failCallback,
    successCallback,
    missionId = '2'
  }: {
    missionId: string;
    route: string;
    failMessage: string;
    address: string;
    additionalPayload?: Record<string, string | number>;
    failCallback?: (err?: any) => void;
    successCallback?: (result: Partial<StartRouteResponseType>) => void;
  }): Promise<Partial<StartRouteResponseType> | void> => {
    try {
      const response = await fetch(
        route,
        getDefaultPostPayload({
          missionId,
          landId: this.landId,
          avatarId: this.avatarId,
          address,
          message: this.signatureMessageKey,
          signature: this.signature,
          ...(additionalPayload ?? {})
        })
      );

      const result = await response.json();

      if (!response.ok) {
        window.toast(result?.message ?? failMessage, {
          appearance: 'error'
        });

        return failCallback?.(result);
      }

      successCallback?.(result);
      return await result;
    } catch (err: any) {
      return window.toast(err.message, {
        appearance: 'error'
      });
    }
  };

  static leaveMission = async () => {
    try {
      const rawResponse = await fetch(
        `${NETWORK_DATA.BACKEND}/missions/leave-mission`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: window.address,
            message: this.signatureMessageKey,
            signature: this.signature,
            missionId: '2',
            landId: this.landId,
            avatarId: this.avatarId
          })
        }
      );

      const jsonData = await rawResponse.json();

      if (jsonData?.errors || jsonData.status >= 300) {
        return null;
      }

      return jsonData;
    } catch (err: any) {
      return window.toast(err.message, {
        appearance: 'error'
      });
    }
  };

  static claimReward = ({
    message,
    signature,
    callback
  }: {
    message: string;
    signature: string;
    callback: () => void;
  }) => {
    const { s, r, v } = signatureToVrs(signature);

    txWrapper(
      window.GM.methods
        .finishMission(message, v, r, s)
        .send({ from: window.address }),
      {
        // @ts-ignore
        addToast: window.toast,
        eventName: 'Mission reward claiming',
        chainData: CURRENT_CHAIN,
        onFail() {
          callback();
          window.navigateHook('/play/0?withToggle=true');
        },
        onPending() {},
        onConfirm() {
          callback();
          window.navigateHook('/play/0?withToggle=true');
        }
      }
    );
  };
}

export default MiningQuestApi;
