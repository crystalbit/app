import { NETWORK_DATA } from '@root/settings';

class PolygonBackend {
  static getLandStats = async () => {
    try {
      const rawResponse = await fetch(
        `${NETWORK_DATA.LAND_META_SERVER}metrics`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      const content = await rawResponse.json();
      return content;
    } catch (err) {
      return {};
    }
  };

  static getHeaderStats = async () => {
    const rawResponse = await fetch(
      `${NETWORK_DATA.LAND_META_SERVER}clny-stat`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    const content = await rawResponse.json();
    return content;
  };
}

export default PolygonBackend;
