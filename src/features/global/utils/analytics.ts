import { NETWORK_DATA } from '@root/settings';
import mixpanel from 'mixpanel-browser';

const trackUserEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => mixpanel.track(eventName, { ...properties, chain: NETWORK_DATA.CHAIN });

const setUserIdentities = (address: string) => {
  mixpanel.alias(address);
  mixpanel.identify(address);
  mixpanel.people.set({ Address: address });
  logDevInfo('SET UP WEB3');
};

export const setUserIdentitiesFiled = (address: string) => {
  mixpanel.identify(`${address}`);

  mixpanel.people.set({
    $name: `${address}`,
    Address: `${address ?? window.address}`
  });
};

const trackGoogleAnalyticsEvent = (
  eventName: string,
  properties?: Record<string, any>
) =>
  window.dataLayer.push({
    event: eventName,
    ...properties
  });

const getDefaultEventPayload = (address: string) => {
  if (!address) return {};
  return {
    address
  };
};

const logDevInfo = (events: string[] | string, groupName?: string) => {
  const isDevMode = process.env.NODE_ENV === 'development';
  if (!isDevMode) return;
  if (Array.isArray(events)) {
    console.group(`${groupName}:` ?? 'Dev logs:');
    events.forEach((event) => console.log(event));
    console.groupEnd();
    return;
  } else {
    console.log(events);
  }
};

const setFBPixel = () => {
  const pixel = localStorage.getItem('fb-pixel');

  if (pixel) {
    const img = new Image();
    img.src = `https://www.facebook.com/tr?id=${pixel}&ev=Lead&noscript=1`;
    document.body.appendChild(img);
  }

  const utmSource = localStorage.getItem('utm_source');

  if (utmSource) {
    const img = new Image();
    img.src = `https://gate.marscolony.io/data/${utmSource}`;
    document.body.appendChild(img);
  }
};

export {
  getDefaultEventPayload,
  logDevInfo,
  setFBPixel,
  setUserIdentities,
  trackGoogleAnalyticsEvent,
  trackUserEvent
};
