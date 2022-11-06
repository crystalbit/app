import { MOBILE_BREAKPOINT } from '@global/constants';
import { fontProperty } from '@global/styles/fonts.styles';
import { WHITE } from '@global/styles/variables';
import styled from 'styled-components';

export const WelcomeScreenMainWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('/UIParts/welcomeScreenBack.jpg');
  background-size: cover;
  background-position: center;
`;

export const WelcomeModalWrapper = styled.div`
  box-sizing: border-box;
  background: rgba(33, 35, 43, 0.6);
  backdrop-filter: blur(10px);
  padding: 30px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  min-width: 504px;
  min-height: 234px;
  position: relative;
  top: 84px;
  left: 134px;

  @media screen and (max-width: 900px) {
    left: 100px;
  }

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    position: absolute;
    left: 0;
    right: 0;
    top: 135px;
    margin-left: auto;
    margin-right: auto;
    min-width: 288px;
    max-width: 60%;
    gap: 90px;
    padding: 30px 27px;
  }
`;

export const WelcomeModalTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  color: ${WHITE};
  gap: 20px;

  p {
    margin: 0;
  }

  p:first-child {
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  p:nth-child(2) {
    display: flex;
    align-items: center;
    gap: 10px;
    ${fontProperty};
    font-family: 'Helvetica', sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;

    svg {
      cursor: pointer;
    }
  }
`;

export const WelcomeModalButtonsBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media screen and (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-direction: column;
  }
`;
