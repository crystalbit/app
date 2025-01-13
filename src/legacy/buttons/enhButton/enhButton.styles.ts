import { WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const EnhButtonWrapper = styled.button<{ isGamePage?: boolean }>`
  display: block;
  border: 0;
  width: 105px;
  height: 30px;
  background-color: #487636;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 2px;
  font-family: 'Play', sans-serif;
  color: ${WHITE};
  cursor: pointer;
  margin-left: ${({ isGamePage }) => (isGamePage ? '0px' : '7px')};
  position: relative;

  &:not([disabled]):hover {
    color: #fe5161;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))
      drop-shadow(0px 0px 20px #fe5161);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.2);
  }

  .enh_button__get {
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
  }

  .enh_button__for {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 11.6px;
    text-align: center;
  }

  ${({ isGamePage }) => {
    if (isGamePage) {
      return css`
        border: none;
        outline: none;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

        .enh_button__get {
          color: #fe5161;
        }

        &:not([disabled]):hover {
          color: white;
        }

        &:disabled {
          background-color: #7c8087;

          .enh_button__get {
            color: rgba(255, 255, 255, 0.5);
          }

          .enh_button__for {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      `;
    }
  }}
`;

const EnhButtonError = styled.div<{
  isGamePage?: boolean;
  isDisabled?: boolean;
  mt?: string;
}>`
  position: absolute;
  top: ${({ mt }) => mt ?? '-13px'};
  color: rgb(255, 0, 0);
  font-size: 10px;
  left: 13px;
  text-align: center;
  text-transform: initial;
  font-weight: 400;
  ${({ isGamePage, isDisabled, mt }) => {
    if (isGamePage || isDisabled) {
      return css`
        top: ${mt ?? '-13px'};
        font-weight: 400;
      `;
    }
  }}
`;

const EhchSidebarWrapper = styled.div`
  margin-top: 15px;
`;

export { EhchSidebarWrapper, EnhButtonError, EnhButtonWrapper };
