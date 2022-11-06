import React from 'react';
import { useSelector } from 'react-redux';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import PolygonSymbol3D from '@arcgis/core/symbols/PolygonSymbol3D';
import SceneView from '@arcgis/core/views/SceneView';
import { buildPopup } from '@features/globus/components/globePopup/popupNodeBuilder';
import {
  PartedMarsMainWrapper,
  PartedMarsViewWrapper
} from '@features/globus/styles/partedMars.styles';
import { initView } from '@features/globus/utils/initView';
import {
  parseTokenNumber,
  simpleFillSymbol,
  toLat,
  toLong
} from '@features/globus/utils/methods';
import { NETWORK_DATA } from '@root/settings';
import { addressSelector } from '@selectors/userStatsSelectors';
import Web3 from 'web3';

interface Props {
  allTokens: string[] | null;
  myTokens: string[] | null;
  height: string;
  handleClaim: (tokens: number[], address: string, web3: Web3) => void;
  balance: number;
  currency: string;
  web3?: React.MutableRefObject<Web3 | null>;
}

export const PartedMars = ({
  height,
  allTokens,
  myTokens,
  handleClaim,
  balance,
  currency
}: Props) => {
  const [curToken, setCurToken] = React.useState<string | null>(null);
  const tokenRef = React.useRef<string | null>(null);
  const hoverLayer = React.useRef<GraphicsLayer>();
  const view = React.useRef<SceneView | null>(null);
  const tokensLayer = React.useRef<GraphicsLayer | null>(null);
  const address = useSelector(addressSelector);

  React.useEffect(() => {
    if (!hoverLayer.current) {
      return;
    }
    hoverLayer.current.removeAll();
    if (myTokens === null || allTokens === null) {
      return;
    }
    if (curToken !== null) {
      const { x, y } = parseTokenNumber(curToken) ?? {};
      if (x !== undefined && y !== undefined) {
        const latitudes: [number, number] = [toLat(y), toLat(y + 1)];
        const longitudes: [number, number] = [toLong(x), toLong(x + 1)];

        const polygon = {
          type: 'polygon',
          rings: [
            [longitudes[0], latitudes[0]],
            [longitudes[0], latitudes[1]],
            [longitudes[1], latitudes[1]],
            [longitudes[1], latitudes[0]]
          ],
          spatialReference: { wkid: 104971 }
        };

        const simpleFillSymbolHover = !allTokens?.includes(curToken)
          ? simpleFillSymbol([33, 222, 33, 0.5]) // Green
          : simpleFillSymbol([200, 0, 0, 0.6]); // Red

        const _curToken = curToken;
        const polygonGraphic = new Graphic({
          geometry: polygon,
          symbol: simpleFillSymbolHover,
          popupTemplate: {
            title: `Land Plot #${_curToken}`,
            content: () =>
              buildPopup({
                longitudes,
                latitudes,
                token: +curToken,
                occupied: allTokens.includes(`${curToken}`),
                balance,
                currency,
                claim,
                address
              })
          }
        });
        hoverLayer.current.add(polygonGraphic);
      }
    }
  }, [curToken, hoverLayer, allTokens, balance, myTokens, currency, address]);

  React.useEffect(() => {
    console.log('RENDERED MAP');
    tokensLayer.current?.removeAll();
    // STEP 1 - render a view as soon as possible
    if (view.current === null) {
      const {
        tokenLayer: _tl,
        hoverLayer: _hl,
        view: _view
      } = initView(tokenRef, handleClaim, setCurToken);
      tokensLayer.current = _tl;
      hoverLayer.current = _hl;
      view.current = _view;
    }

    // STEP 2 - render my tokens as soon as we get them
    // STEP 3 - render all other tokens as soon we get them
    if (myTokens !== null && allTokens !== null) {
      const simpleFillSymbolOrange = simpleFillSymbol([227, 15, 15, 0.5]);
      const simpleFillSymbolGreen = new PolygonSymbol3D({
        symbolLayers: [
          {
            type: 'fill',
            material: { color: [139, 227, 79, 0.4] }
          }
        ]
      });

      // first draw myTokens in green, then allTokens in orange
      for (const tokens of NETWORK_DATA.SOLDOUT
        ? [myTokens]
        : [myTokens, allTokens]) {
        for (const token of Array.from(tokens)) {
          const { x, y } = parseTokenNumber(token) ?? {};
          if (x !== undefined && y !== undefined && y >= 0 && y < 140) {
            const latitudes: [number, number] = [toLat(y), toLat(y + 1)];
            const longitudes: [number, number] = [toLong(x), toLong(x + 1)];

            const polygon = {
              type: 'polygon',
              rings: [
                [longitudes[0], latitudes[0]],
                [longitudes[0], latitudes[1]],
                [longitudes[1], latitudes[1]],
                [longitudes[1], latitudes[0]]
              ],
              spatialReference: { wkid: 104971 }
            };

            const polygonGraphic = new Graphic({
              geometry: polygon,
              symbol: myTokens.includes(token)
                ? simpleFillSymbolGreen
                : simpleFillSymbolOrange
              // popupTemplate: {
              //   title: `Token #1${y.toString().padStart(3, '0')}${x.toString().padStart(3, '0')}`,
              //   content: geoText(longitudes, latitudes),
              // },
            });
            tokensLayer.current?.add(polygonGraphic);
          }
        }
      }
    }
  }, [allTokens, myTokens, tokensLayer]);

  return (
    <PartedMarsMainWrapper>
      <PartedMarsViewWrapper id="viewDiv" height={height} />
    </PartedMarsMainWrapper>
  );
};
