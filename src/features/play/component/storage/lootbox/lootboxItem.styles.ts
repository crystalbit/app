import { BLACK, TOXIC_GREEN, WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const LootboxCardWrapper = styled.div<{
  backgroundImg?: string;
  gear: boolean;
}>`
  width: 224px;
  height: 225px;
  min-height: 225px;
  border: 0.5px solid #737272;
  box-sizing: border-box;
  position: relative;
  background-image: ${({ backgroundImg }) => `url(${backgroundImg})` ?? ''};
  background-size: contain;
  background-color: lightslategray;
  ${({ gear }) => {
    if (!gear)
      return css`
        background-position: 0 -30px;
      `;
  }}
  cursor: pointer;
  &:hover {
    border: 0.5px solid #34ff61;
  }
`;

const LootboxCardButtonWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  width: 100%;

  button {
    height: 30px;
    background: #3d4048;
    border-radius: 4px;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;

    text-align: center;
    text-transform: uppercase;

    color: #36363d;
  }
`;

const LootboxPriceTextBlock = styled.div<{ isModalVersion?: boolean }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${BLACK};

  p,
  span {
    font-family: 'Play', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
  }

  p {
    color: ${WHITE};
  }

  span {
    font-weight: 700;
    color: ${TOXIC_GREEN};
  }

  ${({ isModalVersion }) => {
    if (isModalVersion) {
      return css`
        background-color: transparent;
        width: unset;
        height: unset;
        position: unset;
      `;
    }
  }}
`;

const LootboxCardSignWrapper = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1px solid ${TOXIC_GREEN};
  top: 10px;
  right: 10px;
  position: absolute;
  display: grid;
  place-items: center;

  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.04em;
  color: ${TOXIC_GREEN};
`;

export {
  LootboxCardButtonWrapper,
  LootboxCardSignWrapper,
  LootboxCardWrapper,
  LootboxPriceTextBlock
};
