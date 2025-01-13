import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { lats, longs } from '@features/globus/constants';
import {
  PartedMarsMainWrapper,
  PartedMarsViewWrapper
} from '@features/globus/styles/partedMars.styles';
import {
  parseTokenNumber,
  toLat,
  toLong,
  toTokenNumber
} from '@features/globus/utils/methods';
import { getReserve, reserve } from '@features/globus/utils/reserveHelper';
import { EMPTY_ADDRESS } from '@global/utils/etc';
import {
  entity,
  Extent,
  Globe,
  layer,
  LonLat,
  Popup,
  scene
} from '@openglobus/og';
import { NETWORK_DATA } from '@root/settings';
import { CURRENT_CHAIN } from '@root/settings/chains';
import { isMyLandSelector } from '@selectors/appPartsSelectors';
import {
  cartItemsSelector,
  cartStateSelector
} from '@selectors/cartSliceSelectors';
import { userGameManagerSelector } from '@selectors/commonAppSelectors';
import { addressSelector } from '@selectors/userStatsSelectors';
import { toggleMyLandPopup } from '@slices/appPartsSlice';
import { addItemToCart } from '@slices/cartSlice';
import Web3 from 'web3';
import useMetamask from '@features/global/hooks/useMetamask';

interface Props {
  allTokens: string[] | null;
  myTokens: string[] | null;
  height: string;
  balance: number;
  currency: string;
  web3?: React.MutableRefObject<Web3 | null>;
}

export const OpenGlobus = ({ height, allTokens, myTokens }: Props) => {
  const globe = React.useRef<Globe>();
  const cartEntites: Map<number, entity.Entity> = React.useMemo(
    () => new Map(),
    []
  );
  const reservedEntities: Map<number, entity.Entity> = React.useMemo(
    () => new Map(),
    []
  );
  const cartLayer = React.useRef<layer.Vector>(new layer.Vector('Cart', {}));
  const tokensLayer = React.useRef<layer.Vector>(
    new layer.Vector('Tokens', {})
  );
  const myTokensSet = React.useRef<Set<number>>(new Set());
  const allTokensSet = React.useRef<Set<number>>(new Set());
  const onePlotFee = React.useRef<number>(0);
  const gm = useSelector(userGameManagerSelector);
  const { addToast } = useToasts();
  const address = useSelector(addressSelector);
  const isCartOpened = useSelector(cartStateSelector);
  const isMyLandsOpened = useSelector(isMyLandSelector);
  const cartItems = useSelector(cartItemsSelector);
  const dispatch = useDispatch();
  const popup = React.useRef<Popup>();
  const { makeCallRequest } = useMetamask();

  React.useEffect(() => {
    const timer = setInterval(async () => {
      const reserved = await getReserve();
      if (reserved === null) {
        return;
      }
      updateReserve(reserved);
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    if (!address) {
      return;
    }

    makeCallRequest<string>({
      contract: gm,
      method: 'getFee',
      errorText: 'Fail getting claiming fees',
      params: [1, localStorage.getItem('referralAddress') ?? EMPTY_ADDRESS],
      address: window.address
    }).then((value) => {
      console.log({ value, address: window.address });
      onePlotFee.current =
        Math.floor(parseInt(value?.toString() ?? '0') * 1e-18 * 100) / 100;
    });
  }, [gm, address, addToast]);

  const addCartEntity = React.useCallback(
    (token: number, color = 'rgba(60,0,60,0.5)'): entity.Entity | null => {
      const { x, y } = parseTokenNumber(token) ?? {};
      if (x === undefined || y === undefined) return null;
      const [lat1, lat2]: [number, number] = [toLat(y), toLat(y + 1)];
      const [long1, long2]: [number, number] = [toLong(x), toLong(x + 1)];

      const _entity = new entity.Entity({
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [long1, lat1],
              [long1, lat2],
              [long2, lat2],
              [long2, lat1],
              [long1, lat1]
            ]
          ],
          style: {
            fillColor: color,
            lineColor: 'rgba(255,255,255,0.1)',
            lineWidth: '3px'
          }
        }
      });
      return _entity;
    },
    []
  );

  const updateReserve = React.useCallback(
    (reserved: number[]) => {
      for (const plot of reserved) {
        if (!reservedEntities.has(plot)) {
          console.log('NEW', plot);
          const entity = addCartEntity(+plot, 'rgba(60,60,0,0.5)');
          if (entity) {
            reservedEntities.set(+plot, entity);
            cartLayer.current.addEntities([entity]);
          }
        }
      }
      const reservedSet = new Set<number>(reserved);
      for (const plot of Array.from(reservedEntities.keys())) {
        if (!reservedSet.has(plot)) {
          console.log('DELETE', plot);
          const entity = reservedEntities.get(+plot);
          if (entity) {
            cartLayer.current.removeEntity(entity);
            reservedEntities.delete(+plot);
          }
        }
      }
    },
    [addCartEntity, reservedEntities]
  );

  React.useEffect(() => {
    if (!allTokens || !myTokens) {
      return;
    }
    const entities: entity.Entity[] = [];
    for (const token of myTokens) {
      if (myTokensSet.current.has(+token)) {
        continue;
      }
      const { x, y } = parseTokenNumber(token) ?? {};
      if (x === undefined || y === undefined) continue;
      const [lat1, lat2]: [number, number] = [toLat(y), toLat(y + 1)];
      const [long1, long2]: [number, number] = [toLong(x), toLong(x + 1)];

      const _entity = new entity.Entity({
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [long1, lat1],
              [long1, lat2],
              [long2, lat2],
              [long2, lat1],
              [long1, lat1]
            ]
          ],
          style: {
            fillColor: 'rgba(0,255,255,0.5)',
            lineColor: 'rgba(255,255,255,0.1)',
            lineWidth: '3px'
          }
        }
      });
      myTokensSet.current.add(+token);
      entities.push(_entity);
    }
    for (const token of allTokens) {
      if (allTokensSet.current.has(+token) || myTokensSet.current.has(+token)) {
        allTokensSet.current.add(+token);
        continue;
      }
      allTokensSet.current.add(+token);
      const { x, y } = parseTokenNumber(token) ?? {};
      if (x === undefined || y === undefined) continue;
      const [lat1, lat2]: [number, number] = [toLat(y), toLat(y + 1)];
      const [long1, long2]: [number, number] = [toLong(x), toLong(x + 1)];

      const _entity = new entity.Entity({
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [long1, lat1],
              [long1, lat2],
              [long2, lat2],
              [long2, lat1],
              [long1, lat1]
            ]
          ],
          style: {
            fillColor: 'rgba(255,0,255,0.5)',
            lineColor: 'rgba(255,255,255,0.1)',
            lineWidth: '3px'
          }
        }
      });
      entities.push(_entity);
    }
    if (entities.length) {
      tokensLayer.current.addEntities(entities);
    }
  }, [myTokens, allTokens]);

  useEffect(() => {
    if (popup.current) {
      if (isMyLandsOpened || isCartOpened) popup.current.setVisibility(false);
    }
  }, [isCartOpened, isMyLandsOpened, popup]);

  // @ts-ignore
  window.addToCart = React.useCallback(
    (token: number, sender: unknown) => {
      if (cartItems?.length >= 10) {
        addToast('Maximum land plots in the cart reached', {
          appearance: 'error'
        });
        return;
      }

      reserve(+token)
        .then((reserved) => {
          if (reserved === null) {
            throw new Error();
          } else {
            const cart = Array.from(cartEntites.keys()).map((k) =>
              k.toString()
            );
            cart.push(token.toString());
            dispatch(addItemToCart(Array.from(cart)));
            updateReserve(reserved);
          }
        })
        .catch(() => {
          addToast('Reservation error', { appearance: 'error' });
        });

      (sender as HTMLElement).onclick = () =>
        // @ts-ignore
        window?.goToCart(sender);
      (sender as HTMLElement).innerText = 'Go to cart';
    },
    [cartItems?.length, dispatch, addToast]
  );

  React.useEffect(() => {
    const currentSet: Set<number> = new Set(
      cartItems.map((item) => parseInt(item))
    );
    for (const item of Array.from(cartEntites.keys())) {
      if (!currentSet.has(item)) {
        const entity = cartEntites.get(item);
        if (entity) {
          cartLayer.current.removeEntity(entity);
        }
        cartEntites.delete(item);
      }
    }
    const entitiesToAdd: entity.Entity[] = [];
    for (const item of Array.from(currentSet)) {
      if (!cartEntites.has(item)) {
        const entity = addCartEntity(item);
        if (entity) {
          cartEntites.set(item, entity);
          entitiesToAdd.push(entity);
        }
      }
    }
    if (entitiesToAdd.length > 0) {
      cartLayer.current.addEntities(entitiesToAdd);
    }
  }, [addCartEntity, cartEntites, cartItems]);

  // @ts-ignore
  const isInCart = (window.isInCart = React.useCallback(
    (token: number | null): boolean => {
      if (token === null) return false;
      return cartEntites.has(+token);
    },
    []
  ));

  let lastEntity = React.useRef<entity.Entity>();
  let currentToken = React.useRef<number>();
  const setCurrentTokenNumber = React.useCallback(
    (tokenNumber: number | null) => {
      if (!tokenNumber || currentToken.current === tokenNumber) {
        return;
      }
      currentToken.current = tokenNumber;
      const { x, y } = parseTokenNumber(tokenNumber) ?? {};
      if (x !== undefined && y !== undefined) {
        const [lat1, lat2]: [number, number] = [toLat(y), toLat(y + 1)];
        const [long1, long2]: [number, number] = [toLong(x), toLong(x + 1)];
        if (lastEntity.current) {
          tokensLayer.current!.removeEntity(lastEntity.current);
        }
        lastEntity.current = new entity.Entity({
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [long1, lat1],
                [long1, lat2],
                [long2, lat2],
                [long2, lat1],
                [long1, lat1]
              ]
            ],
            style: {
              fillColor: 'rgba(255,0,0,0.5)',
              lineColor: 'rgba(255,255,255,0.1)',
              lineWidth: '3px'
            }
          }
        });
        tokensLayer.current!.addEntities([lastEntity.current]);
      }
    },
    []
  );

  const mouseHandler = React.useCallback(
    (e: any) => {
      if (popup.current?._visibility) return;

      const lonLat = globe.current!.planet.getLonLatFromPixelTerrain(e);
      if (!lonLat) return;
      const { lon, lat } = lonLat;
      const tokenNumber = toTokenNumber(lat, lon);

      setCurrentTokenNumber(tokenNumber);
    },
    [setCurrentTokenNumber]
  );

  window.navigateToToken = React.useCallback((tokenId: number) => {
    const coords = parseTokenNumber(tokenId);
    if (!coords) {
      return;
    }
    const { x, y } = coords;

    const latitudes = [toLat(y - 10), toLat(y + 11)];
    const longitudes = [toLong(x - 10), toLong(x + 11)];

    globe.current!.planet.viewExtent(
      Extent.createFromArray([
        longitudes[0],
        latitudes[0],
        longitudes[1],
        latitudes[1]
      ])
    );
  }, []);

  React.useEffect(() => {
    const osm = new layer.XYZ('Mars', {
      isBaseLayer: true,
      // url: 'https://{s}-polygon-tiles.marscolony.io/tiles/{z}/{x}/{y}.png',
      // url: 'https://{s}-tiles.router9.xyz/tile/{z}/{x}/{y}.png',
      url: 'https://terrain.openglobus.org/mars/sat/{z}/{x}/{y}.png',
      // visibility: true,
      maxNativeZoom: 8
    });

    const ct = new layer.CanvasTiles('ct', {
      visibility: true,
      isBaseLayer: false,
      drawTile(material: Record<string, any>, applyCanvas: Function) {
        let cnv = document.createElement('canvas');
        let ctx = cnv.getContext('2d');
        cnv.width = 256;
        cnv.height = 256;
        if (!ctx) return;
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        if (material.segment.isPole) {
          const { northEast } = material.segment.getExtentLonLat();
          const { lat } = northEast;
          ctx.fillStyle = lat > 0 ? '#ffffff' : '#ffffff';
          ctx.fillRect(0, 0, cnv.width, cnv.height);

          applyCanvas(cnv);
        }
      }
    });

    const grid = [];
    for (const i of longs) {
      const mer = [];
      for (const j of lats) {
        mer.push(new LonLat(i, j, 3000));
      }
      grid.push(mer);
    }

    for (const i of lats) {
      const mer = [];
      for (const j of [-180, ...longs]) {
        mer.push(new LonLat(j, i, 3000));
      }
      grid.push(mer);
    }

    const collection = new layer.Vector('Collection', {
      entities: [
        {
          polyline: {
            pathLonLat: grid,
            thickness: 0.5,
            color: 'rgba(0, 0, 0, 0.8)'
          }
        }
      ],
      polygonOffsetUnits: -100000
    });

    globe.current = new Globe({
      target: 'viewDiv',
      name: 'Mars',
      layers: [osm, collection, ct, cartLayer.current, tokensLayer.current],
      autoActivated: true,
      useNightTexture: false,
      useSpecularTexture: false,
      skybox: scene.SkyBox.createDefault('res/'),
      sun: { active: false },
      minAltitude: 1000000,
      maxAltitude: 30000000
    });

    osm.events.on('mousemove', mouseHandler, null);
    cartLayer.current!.events.on('mousemove', mouseHandler, null);
    tokensLayer.current!.events.on('mousemove', mouseHandler, null);

    // tokens.events.on("mouseleave", function (e: any) {
    //   // console.log('LEAVE');
    //   e.pickingObject.geometry.setFillColor(1, 1, 1, 0.01);
    //   // e.pickingObject.geometry.setLineColor(0.2, 0.6, 0.8, 0.6);
    // }, null);
    // tokens.events.on("mouseenter", function (e: any) {
    //   // console.log('ENTER');

    //   e.pickingObject.geometry.bringToFront();
    //   e.pickingObject.geometry.setFillColor(1, 0, 0, 0.4);
    //   // e.pickingObject.geometry.setLineColor(1, 0, 0, 1.0);
    // }, null);
    // tokens.events.on("lclick", function (e: any) {
    //   globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
    // }, null);
    // tokens.events.on("touchstart", function (e: any) {
    //   globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
    // }, null);

    globe.current!.planet.viewExtent(
      Extent.createFromArray([-158, 4, -86, 69])
    );

    window.ogPopup = popup.current = new Popup({
      planet: globe.current!.planet,
      offset: [0, 0],
      visibility: false
    });

    return () => {
      if (document.getElementById('viewDiv')) {
        document.getElementById('viewDiv')!.innerHTML = '';
      }
    };
  }, [dispatch, isInCart, mouseHandler, setCurrentTokenNumber]);

  React.useEffect(() => {
    if (!address || !globe.current || !globe.current.planet) {
      return;
    }
    globe.current!.planet.renderer.events.on('lclick', (e: any) => {
      let lonLat = globe.current!.planet.getLonLatFromPixelTerrain(e);

      if (lonLat.height > 100) {
        // клик в космосе
        return;
      }

      const tokenNumber = toTokenNumber(lonLat.lat, lonLat.lon);
      setCurrentTokenNumber(tokenNumber);

      // @ts-ignore
      const { x, y } = parseTokenNumber(tokenNumber) ?? {};

      if (x === undefined || y === undefined) return; // but 0-values are ok!

      const latitudes = [toLat(y).toFixed(1), toLat(y + 1).toFixed(1)].join(
        ', '
      );
      const longitudes = [toLong(x).toFixed(1), toLong(x + 1).toFixed(1)].join(
        ', '
      );

      window.goToCart = () => {
        dispatch(toggleMyLandPopup('cart'));
      };

      let status = allTokensSet.current.has(tokenNumber ?? -1)
        ? 'Occupied'
        : 'Available';
      if (reservedEntities.has(tokenNumber ?? -1)) {
        status = 'Reserved';
      }

      popup.current?.setContent(`<div class="claim-popup">
        <div class="popup-title">
          Land Plot #${tokenNumber}
        </div>
        <div style="display: flex">
          <div>
            <img src="${
              NETWORK_DATA.LAND_META_SERVER
            }${tokenNumber}.png" style="width: 150px; height: 150px"  alt="token-img"/>
          </div>
          <div class="popup-right">
            <div>
              Status: ${status}
              <br/>
              Longitudes ${longitudes}
              <br/>
              Latitudes  ${latitudes}
            </div>
            ${
              !allTokensSet.current.has(tokenNumber ?? -1) &&
              address &&
              !reservedEntities.has(tokenNumber ?? -1)
                ? `
              <div>
                <button onclick="window.claim([${tokenNumber}])" class="popup-claim-now">
                  ${
                    onePlotFee.current > 0
                      ? `<span id="claim">Claim now for ${onePlotFee.current} ${CURRENT_CHAIN.ticker}</span>`
                      : ''
                  }
                  ${
                    onePlotFee.current === 0
                      ? `<span id="claim">Claim now</span>`
                      : ''
                  }
                </button>
              </div>
              <div>
                ${
                  !isInCart(tokenNumber) && address
                    ? `
                  <button onclick="window.addToCart(${tokenNumber}, this)" class="popup-add-cart">
                    Add to cart
                  </button>
                `
                    : `
                  <button onclick="window.goToCart(this)" class="popup-add-cart">
                    Go to cart
                  </button>
                `
                }
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>`);

      let groundPos = globe.current!.planet.getCartesianFromMouseTerrain();

      popup.current?.setCartesian3v(groundPos);
      popup.current?.setVisibility(true);
    });
  }, [address, dispatch, isInCart, setCurrentTokenNumber, globe]);

  return (
    <PartedMarsMainWrapper>
      <PartedMarsViewWrapper id="viewDiv" height={height} />
    </PartedMarsMainWrapper>
  );
};
