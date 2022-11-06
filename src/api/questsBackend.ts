import { NETWORK_DATA } from '@root/settings';

class QuestsBackend {
  static startCodingMission = async (data: {
    message: string;
    address: string;
    signature: string;
    avatarId: number;
    landId: number;
    missionId: number;
  }) => {
    const rawResponse = await fetch(
      `${NETWORK_DATA.BACKEND}/missions/0/start`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return await rawResponse.json();
  };

  static startDecryptMission = async (data: {
    message: string;
    address: string;
    signature: string;
    avatarId: number;
    landId: number;
    missionId: number;
  }) => {
    const rawResponse = await fetch(
      `${NETWORK_DATA.BACKEND}/missions/1/start`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return await rawResponse.json();
  };

  static checkDecryptWord = async (data: {
    message: string;
    address: string;
    signature: string;
    word: string;
    avatarId: number;
    landId: number;
    missionId: number;
  }) => {
    const rawResponse = await fetch(
      `${NETWORK_DATA.BACKEND}/missions/1/check`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    return await rawResponse.json();
  };

  static pingCodingMission = async (data: {
    message: string;
    address: string;
    signature: string;
    avatarId: number;
    landId: number;
    missionId: number;
  }) => {
    const rawResponse = await fetch(`${NETWORK_DATA.BACKEND}/missions/0/ping`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await rawResponse.json();
  };

  static getLimits = async (data: {
    landIds: unknown[];
    avatarIds: unknown[];
  }) => {
    try {
      const rawResponse = await fetch(
        `${NETWORK_DATA.BACKEND}/missions/limits`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const jsonData = await rawResponse.json();

      if (jsonData?.errors || jsonData.status >= 300) {
        return { avatarIds: [], landIds: [] };
      }

      return jsonData;
    } catch (err) {
      return err;
    }
  };

  static getRandomLand = async (data: {
    address: string;
    excludedLandId?: number;
    additionalMissionId?: number;
  }) => {
    let payload = data;

    if (!data.excludedLandId) {
      const { excludedLandId, ...rest } = data;
      payload = rest;
    }

    try {
      const rawResponse = await fetch(
        data.additionalMissionId
          ? `${NETWORK_DATA.BACKEND}/missions/random-land/${data.additionalMissionId}`
          : `${NETWORK_DATA.BACKEND}/missions/random-land`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      const jsonData = await rawResponse.json();

      if (jsonData?.errors || jsonData.status >= 300) {
        return null;
      }

      if (!jsonData.success) {
        return window.toast(jsonData?.errorText ?? 'Error, please try again', {
          appearance: 'error'
        });
      }

      return jsonData;
    } catch (err) {
      return null;
    }
  };

  static leaveMission = async (data: {
    address: string;
    message: string;
    signature: string;
    avatarId: number;
    landId: number;
    missionId: number;
  }) => {
    try {
      const rawResponse = await fetch(
        `${NETWORK_DATA.BACKEND}/missions/leave-mission`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const jsonData = await rawResponse.json();

      if (jsonData?.errors || jsonData.status >= 300) {
        return null;
      }

      return jsonData;
    } catch (err) {
      return null;
    }
  };
}

export default QuestsBackend;
