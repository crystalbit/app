import { commonFlexColumn, commonFlexLine } from '@global/styles/app.styles';
import { fontProperty } from '@global/styles/fonts.styles';
import { RGB_BLACK, WHITE } from '@global/styles/variables';
import styled, { css } from 'styled-components';

const LandsSidebarWrapper = styled.div<{
  withLands?: boolean;
  isVisible?: boolean;
  isMobile?: boolean;
}>`
  background: ${RGB_BLACK};
  backdrop-filter: blur(10px);
  width: 508px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  padding: 40px 16px 40px 8px;
  z-index: 10;
  transition: all 0.3s;
  box-sizing: border-box;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  left: -700px;
  opacity: 0;
  visibility: hidden;

  ${({ withLands, isVisible, isMobile }) => {
    const withLandsPart = withLands
      ? css`
          padding: 20px 16px 20px 8px;
        `
      : css``;
    const mobilePart = isMobile
      ? css`
          left: 0;
          width: 100vw;
          padding: 60px 16px 20px;
        `
      : css``;

    if (isVisible) {
      return css`
        left: 70px;
        opacity: 1;
        visibility: visible;
        ${withLandsPart};
        ${mobilePart};
      `;
    }
  }};
`;

const NoLandsTitle = styled.div`
  ${fontProperty};
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 30px;
`;

const LandsSidebarHeaderWrapper = styled.header<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${WHITE};
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        align-items: flex-start;
        margin-bottom: 15px;
        div:first-child {
          margin-bottom: 10px;
        }
      `;
    }
  }};
`;

const LandsBlock = styled.div`
  margin-top: 40px;
`;

const ButtonSubText = styled.p<{ withRevshare?: boolean }>`
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 11px;
  margin: 6px 0 0 0;
  text-align: center;

  ${({ withRevshare }) => {
    if (!withRevshare) {
      return css`
        font-size: 12px;
        line-height: 14px;
      `;
    }
  }}
`;

const ActiveLandsTitle = styled.p`
  ${fontProperty};
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  text-transform: uppercase;
  margin: 0;
`;

const ActiveLandsFirstLine = styled.div<{ withRevshare?: boolean }>`
  ${commonFlexLine};
  align-items: flex-start;
  gap: 20px;
  margin-bottom: ${({ withRevshare }) => (withRevshare ? '40px' : '20px')};
`;

const ActiveLandsControlWrapper = styled.div`
  ${commonFlexColumn};
`;

export {
  ActiveLandsControlWrapper,
  ActiveLandsFirstLine,
  ActiveLandsTitle,
  ButtonSubText,
  LandsBlock,
  LandsSidebarHeaderWrapper,
  LandsSidebarWrapper,
  NoLandsTitle
};
