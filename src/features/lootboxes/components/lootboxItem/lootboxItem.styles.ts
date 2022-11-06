import styled, { css } from 'styled-components';

const LootboxCardWrapper = styled.div<{
  backgroundImg?: string;
  gear: boolean;
}>`
  width: 204px;
  height: 230px;
  min-height: 230px;
  border: 1px solid #ffffff;
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
    border: 1px solid #34ff61;
  }
`;

const LootboxCardButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;

  button {
    height: 30px;
    background: #34ff61;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;

    text-align: center;
    text-transform: uppercase;

    color: #36363d;
  }
`;

export { LootboxCardButtonWrapper, LootboxCardWrapper };
