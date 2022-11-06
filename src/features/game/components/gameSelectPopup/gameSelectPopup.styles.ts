import { RGB_BLACK } from '@features/global/styles/variables';
import styled, { css } from 'styled-components';

const GameSelectPopupWrapper = styled.div<{ x: string; y: string }>`
  box-sizing: border-box;
  padding: 17.5px 62px;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 200;
  ${({ x, y }) => {
    return css`
      top: ${y};
      left: ${x};
    `;
  }};
`;

const GameSelectInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 17px 62px;
  border-radius: 4px 4px 0 0;
  gap: 10px;
`;

const GameSelectPopupTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #ffffff;
`;

const GameSelectPopupText = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  max-width: 260px;
  color: #ffffff;
`;

const GameSelectPopupBottom = styled.div`
  background: linear-gradient(
    176.17deg,
    ${RGB_BLACK} -13.48%,
    rgba(10, 0, 0, 0.6) 112.63%
  );
  backdrop-filter: blur(10px);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0 0 4px 4px;
`;

const GameSelectPopupList = styled.div<{ itemsCount?: number }>`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: ${({ itemsCount }) =>
    itemsCount === 1 ? 'center' : 'space-between'};
`;

const GameSelectPopupBottomItem = styled.div<{ isDisabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;

  p {
    margin: 0;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    color: #ffffff;
  }

  ${({ isDisabled }) => {
    if (isDisabled) {
      return css`
        cursor: not-allowed;
        p {
          color: rgba(255, 255, 255, 0.5);
        }
      `;
    }
  }};
`;

const GameSelectPopupLevel = styled.div`
  position: absolute;
  top: 10px;
  right: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

export {
  GameSelectInnerWrapper,
  GameSelectPopupBottom,
  GameSelectPopupBottomItem,
  GameSelectPopupLevel,
  GameSelectPopupList,
  GameSelectPopupText,
  GameSelectPopupTitle,
  GameSelectPopupWrapper
};
