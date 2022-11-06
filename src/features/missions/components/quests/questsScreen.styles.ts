import { BUTTON_TYPES } from '@features/missions/constants';
import { fontProperty } from '@global/styles/fonts.styles';
import styled, { css } from 'styled-components';

const WrapperBaseStyles = css`
  width: 100vw;
  height: 100vh;
  background: #111b23;
  border: 2px solid #5e8aa8;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;

  ${fontProperty};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 10px;
  line-height: 13px;

  color: #ffffff;

  * {
    font-family: inherit;
    color: inherit;
    box-sizing: border-box;
  }
`;

const QuestsScreenWrapper = styled.div`
  ${WrapperBaseStyles};
  position: absolute;

  top: 180px;
  left: 610px;
  width: 680px;
  min-width: 680px;
  height: 405px;
  min-height: 405px;
`;

const StatsScreenWrapper = styled.div`
  ${WrapperBaseStyles};
  position: absolute;
  width: 332px;
  height: 335px;
  top: 235px;
  right: 132px;
`;

const QuestsScreenTitle = styled.div<{
  backgroundColor?: string;
  color?: string;
}>`
  ${({ backgroundColor, color }) => {
    if (backgroundColor || color) {
      return css`
        background-color: ${backgroundColor ?? ''};
        color: ${color ?? ''};
      `;
    } else {
      return css`
        background: #5e8aa8;
      `;
    }
  }}
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TitleRound = styled.span<{
  borderColor?: string;
}>`
  border: 1.5px solid
    ${({ borderColor }) => borderColor ?? 'rgba(255, 255, 255, 0.8)'};
  border-radius: 50%;
  width: 9px;
  height: 9px;
`;

const ParagraphText = styled.p<{
  marginBottom?: string;
}>`
  margin: ${({ marginBottom }) => marginBottom ?? '0'};
`;

const TextContentWrapper = styled.section`
  padding-left: 30px;
  padding-top: 15px;
  padding-bottom: 15px;
  background: #212b30;
`;

const QuestsListWrapper = styled.section`
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;

  ul {
    padding-left: 0;
    list-style-type: none;
  }
`;

const QuestsListItem = styled.li<{
  isActive: boolean;
  isHighlighted?: boolean;
}>`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    width: 250px;
    justify-content: space-between;
    gap: 3%;

    span {
      width: 30%;
      text-align: right;
      min-width: 30px;
    }
  }

  opacity: ${({ isActive }) => (isActive ? 1 : 0.6)};

  background: ${({ isHighlighted }) => (isHighlighted ? '#5e8aa8' : 'unset')};

  &:hover {
    background: #5e8aa8;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SimpleTextWrapper = styled.section`
  padding-left: 40px;
  padding-right: 40px;
`;

const MainComputerWrapper = styled.div<{ isPopupOpened?: boolean }>`
  width: 1920px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  //overflow: scroll;
  background: #36363d;

  * {
    box-sizing: border-box;
  }
`;

const MainComputerScreenBlock = styled.div<{ isPopupOpened?: boolean }>`
  width: 1920px;
  min-width: 1920px;
  height: 943px;
  min-height: 943px;
  position: absolute;
  overflow-y: hidden;
  left: 0;
  ${({ isPopupOpened }) => {
    if (isPopupOpened) {
      return css`
        @media (max-width: 900px) {
          width: unset;
          min-width: unset;
        }
      `;
    }
  }}
`;

const CommonButtonWrapper = styled.img`
  box-sizing: border-box;
  height: 58px;
  width: 150px;
  display: block;
  z-index: 20;
`;

const WideButtonWrapper = styled.img`
  box-sizing: border-box;
  height: 56px;
  width: 200px;
  display: block;
  z-index: 20;
`;

const TriangleButtonWrapper = styled.img`
  box-sizing: border-box;
  height: 50px;
  width: 155px;
  display: block;
  z-index: 20;
`;

const QuestsScreenButtonWrapper = styled.div`
  position: fixed;
  z-index: 100;
  left: 35px;
  top: 20px;
`;

const BlockScreenButton = styled.div<{ Position?: string; Cursor?: string }>`
  position: ${({ Position }) => Position ?? ''};
  cursor: ${({ Cursor }) => Cursor ?? ''};
`;

const GreenQuestButtonText = styled.p<{
  color?: string;
  type?: string;
  Opacity?: string;
  Left?: string;
}>`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;

  text-align: center;
  text-transform: uppercase;

  margin: 0;
  position: absolute;
  left: ${({ Left }) => Left ?? '36%'};
  top: 4px;
  opacity: ${({ Opacity }) => Opacity ?? '0.8'};

  ${({ color, type }) => {
    if (color === 'green' && type === BUTTON_TYPES.triangle) {
      return css`
        color: #000000;
        mix-blend-mode: overlay;
        opacity: 0.8;
        text-shadow: 0 0 10px #34ff61;
        font-size: 18px;
        left: 27%;
        top: 32%;
        font-weight: 700;
      `;
    }

    if (color === 'red' && type === BUTTON_TYPES.triangle) {
      return css`
        color: #000000;
        mix-blend-mode: overlay;
        opacity: 0.8;
        text-shadow: 0 0 10px #34ff61;
        font-size: 18px;
        left: 30%;
        top: 32%;
        font-weight: 700;
      `;
    }

    if (color === 'red' && type === BUTTON_TYPES.common) {
      return css`
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        text-transform: uppercase;
        color: #f55b5d;
      `;
    }

    if (color === 'green') {
      return css`
        color: #34ff61;
        mix-blend-mode: normal;
        text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25), 0 0 20px #34ff61;
      `;
    }

    if (color === 'yellow') {
      return css`
        color: #ffd600;
      `;
    }
  }}
`;

const RewardButton = styled.div`
  padding: 3px 6px;
  width: 108px;
  height: 19px;
  background: #34ff61;
  border-radius: 2px;

  ${fontProperty};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 10px;
  line-height: 13px;

  color: #000000;
`;

const MissionsTableHeader = styled.div`
  margin-top: 20px;
  background: #212b30;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 10px;
  line-height: 14px;
  color: white;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
    width: 250px;
    justify-content: space-between;
    gap: 3%;

    span {
      width: 30%;
      text-align: right;
      min-width: 30px;
    }
  }
`;

export {
  BlockScreenButton,
  CommonButtonWrapper,
  GreenQuestButtonText,
  MainComputerScreenBlock,
  MainComputerWrapper,
  MissionsTableHeader,
  ParagraphText,
  QuestsListItem,
  QuestsListWrapper,
  QuestsScreenButtonWrapper,
  QuestsScreenTitle,
  QuestsScreenWrapper,
  RewardButton,
  SimpleTextWrapper,
  StatsScreenWrapper,
  TextContentWrapper,
  TitleRound,
  TriangleButtonWrapper,
  WideButtonWrapper
};
