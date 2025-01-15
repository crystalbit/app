import { fontProperty } from '@global/styles/fonts.styles';
import { LIGHT_GRAY, TOXIC_GREEN, WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const NavbarBackButton = styled.button<{ dimension?: string }>`
  border: 1px solid #7c8087;
  outline: none;
  cursor: pointer;
  height: calc(100% - 40px);
  width: fit-content;
  display: flex;
  align-items: center;
  margin-right: 40px;
  background-color: #fe5161;
  padding: 9px;

  text-transform: uppercase;
  ${fontProperty};
  font-weight: bold;
  font-size: 12px;

  &:not([disabled]):hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))
      drop-shadow(0px 0px 20px #fe5161);
  }

  ${({ dimension }) => {
    if (dimension) {
      return css`
        width: ${dimension};
        height: ${dimension};
      `;
    }
  }}
  a,
  button {
    color: inherit;
    text-decoration: none;
    background-color: transparent;
    border: none;
  }

  button {
    padding: 0;
  }

  p {
    margin-bottom: 0;
  }
`;

const MyAccountIconWrapper = styled.div<{
  mr?: string;
  isCartOpened?: boolean;
}>`
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  background-color: #1c1c1f;
  border-radius: 50%;
  margin-right: ${({ mr }) => mr ?? 'unset'};
  position: relative;
  cursor: pointer;

  svg {
    position: relative;
    top: -1px;
    left: 0.5px;
  }

  ${({ isCartOpened }) => {
    if (isCartOpened)
      return css`
        outline: 2px solid ${TOXIC_GREEN};
      `;
  }}
`;

const CartCloseIconWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 16px;
  cursor: pointer;
`;

const CartIconCounter = styled.div`
  border-radius: 50%;
  background: #fe5161;
  color: black;
  display: grid;
  align-items: center;
  min-width: 15px;
  min-height: 15px;
  position: absolute;
  font-weight: 400;
  font-size: 11px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.04em;
  z-index: 10;
  right: -5px;
  top: 4px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
`;

const RevenuButtonWrapper = styled.div`
  font-family: 'Play', sans-serif;
  display: flex;
  gap: 6px;
  cursor: pointer;

  .counter {
    padding: 2px 6px;

    font-weight: 400;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: -0.02em;
    color: #fe5161;
    background: ${LIGHT_GRAY};
    border-radius: 4px;
  }

  span {
    font-family: 'Helvetica', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: ${WHITE};
  }
`;

export {
  CartCloseIconWrapper,
  CartIconCounter,
  MyAccountIconWrapper,
  NavbarBackButton,
  RevenuButtonWrapper
};
