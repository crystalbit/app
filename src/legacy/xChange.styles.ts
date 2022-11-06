import styled from 'styled-components';

const XChangePageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  background: #36363d;

  * {
    box-sizing: border-box;
  }
`;

const DexBackground = styled.div`
  background-image: url('/UIParts/dexOptimized.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position-y: 26%;
  background-position-x: 50%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

const StyledTvImage = styled.img`
  height: 100%;
  width: 100%;
  z-index: 10;
`;

const DexRow = styled.div`
  margin-top: calc((100vh - var(--dex-height) + 35px) * 0.26);
  height: var(--dex-height);
  width: 100vw;
`;

const DexCol = styled.div`
  margin-left: calc((100vw - var(--dex-width)) / 2);
  width: var(--dex-width);
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 15px;

    > * {
      &::-webkit-scrollbar {
        display: none !important;
      }

      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }
  }
`;

const DexRowButtons = styled.div`
  margin-top: 111px;
  width: 100vw;
`;

const DexButtons = styled.div`
  margin-left: calc((100vw - var(--buttons-width)) / 2);
  width: calc(var(--buttons-width) + 10px);
  display: flex;
  align-content: space-between;

  .button {
    cursor: pointer;
  }
`;

const DexButtonsSeparator = styled.div`
  flex: 1;
`;

export {
  DexBackground,
  DexButtons,
  DexButtonsSeparator,
  DexCol,
  DexRow,
  DexRowButtons,
  StyledTvImage,
  XChangePageWrapper
};
