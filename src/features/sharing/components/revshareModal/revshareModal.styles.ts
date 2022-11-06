import { fontProperty } from '@global/styles/fonts.styles';
import { BLACK, WHITE } from '@global/styles/variables';
import styled from 'styled-components';

const RevshareModalTitle = styled.span`
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  text-transform: uppercase;
  color: ${WHITE};

  @media screen and (max-width: 700px) {
    margin-top: 40px;
  }
`;

const RevshareModalSubtitle = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 78px;
`;

const RevshareModalContentWrapper = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RevshareModalRangeWrapper = styled.div`
  position: relative;
  width: fit-content;
  margin-bottom: 80px;

  @media screen and (max-width: 400px) {
    > div {
      width: 180px !important;
    }
  }

  .range-after,
  .range-before {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.04em;
    color: white;
  }

  .range-after {
    position: absolute;
    right: -40px;
    top: -7px;
  }

  .range-before {
    position: absolute;
    left: -75px;
    top: -7px;
  }

  .range-personal-value,
  .range-shared-value {
    ${fontProperty};
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.04em;
    font-family: Helvetica, sans-serif;
    color: white;
  }

  .range-personal-value {
    bottom: -25px;
    position: absolute;
    left: -3px;
  }
  .range-shared-value {
    bottom: -25px;
    position: absolute;
    right: -3px;
  }
`;

const CancelRevshareButton = styled.span`
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  text-transform: uppercase;
  color: #60e47d;
  cursor: pointer;
  position: fixed;
  bottom: 55px;

  @media screen and (min-width: 700px) {
    display: none;
  }
`;

const RevshareActionButton = styled.button`
  box-sizing: border-box;
  font-size: 12px;
  padding-left: 44px;
  padding-right: 44px;
  height: 30px;
  border: none;
  color: ${BLACK};
  background: #34ff61;
  margin-bottom: 40px;
  max-width: 114px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 700;
  line-height: 14px;

  &:disabled {
    color: #36363d;
    background: linear-gradient(90deg, #f5f0f0 -3.55%, #a4a5b2 107.42%);
  }

  @media screen and (max-width: 700px) {
    width: 90%;
    height: 50px;
    max-width: 100%;
    position: fixed;
    bottom: 60px;
    font-weight: 700;
    font-size: 18px;
    line-height: 21px;
  }
`;

export {
  CancelRevshareButton,
  RevshareActionButton,
  RevshareModalContentWrapper,
  RevshareModalRangeWrapper,
  RevshareModalSubtitle,
  RevshareModalTitle
};
