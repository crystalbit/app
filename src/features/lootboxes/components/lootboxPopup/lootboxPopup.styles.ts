import { fontProperty } from '@global/styles/fonts.styles';
import { WHITE } from '@global/styles/variables';
import styled from 'styled-components';

const LootboxPopupWrapper = styled.div`
  position: absolute;
  box-sizing: border-box;
  height: 700px;
  width: 700px;
  border: 1px solid #c4c4c4;
  top: -60px;
  left: 0;
  z-index: 1000;

  * {
    box-sizing: border-box;
  }
`;

const LoadingWrapper = styled.div<{
  Position?: string;
  Top?: string;
  Left?: string;
}>`
  position: ${({ Position }) => Position ?? ''};
  top: ${({ Top }) => Top ?? '0'};
  left: ${({ Left }) => Left ?? '0'};
`;

const LootboxPopupBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(40px);
`;

const LootboxPopupShadowBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(36, 37, 58, 0.6);
  backdrop-filter: blur(16px);
  z-index: -1;
  width: 100%;
  height: 100%;
`;

const LootboxPopupContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 56px;
  padding-bottom: 56px;
`;

const LootboxPopupSubtitle = styled.div`
  color: rgba(255, 255, 255, 0.6);

  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.04em;
`;

const LootboxPopupTitle = styled.div`
  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  text-align: center;
  text-transform: uppercase;
  color: ${WHITE};
  text-shadow: 0 0 3px rgba(162, 209, 241, 0.7);
`;

const LootboxPopupCrate = styled.img`
  height: 415px;
  width: 415px;
  border: 1px solid #c4c4c4;
  background-size: cover;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const LootboxPopupButton = styled.button`
  cursor: pointer;
  min-height: 50px;
  left: calc(50% - 365px / 2 + 8px);
  background: #fe5161;
  color: #36363d;

  ${fontProperty};
  font-family: 'Play', monospace;
  line-height: 21px;

  text-align: center;
  text-transform: uppercase;

  border: none;

  padding-left: 44px;
  padding-right: 44px;

  box-sizing: border-box;

  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(90deg, #f5f0f0 -3.55%, #a4a5b2 107.42%);
    color: #36363d;
  }
`;

export {
  LoadingWrapper,
  LootboxPopupBackground,
  LootboxPopupButton,
  LootboxPopupContent,
  LootboxPopupCrate,
  LootboxPopupShadowBackground,
  LootboxPopupSubtitle,
  LootboxPopupTitle,
  LootboxPopupWrapper
};
