import { DARK_GREY, WHITE } from '@features/global/styles/variables';
import styled from 'styled-components';

const AvatarListBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 629px) {
    padding-top: 85px;
  }
`;

const NoAvatar = styled.h1`
  color: ${WHITE};
`;

const AvatarHeaderBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (max-width: 630px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const SelectBlock = styled.div`
  margin: 55px 0 0 20px;

  @media (max-width: 630px) {
    margin: 20px 0 0 0;
  }
`;

const AvatarCardBlock = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 60vw;
  height: 64vh;
  position: relative;
  top: 50px;
  column-gap: 10px;
  row-gap: 11px;
  overflow-y: scroll;
  padding-bottom: 100px;
  &::-webkit-scrollbar {
    display: none;
  }
  > div:last-child {
    margin-bottom: 100px;
  }
`;

const BlockButtonAvatar = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 90px;
  background: ${DARK_GREY};
  z-index: 1;
  position: fixed;
  bottom: 0;
`;

const TitleBlock = styled.div`
  padding-top: 55px;
  p {
    font-family: 'Play', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 48px;
    text-align: center;
    text-transform: uppercase;
    color: #ffffff;
    margin: 0;
  }
  @media (max-width: 630px) {
    padding: 0;
  }
`;

export {
  AvatarCardBlock,
  AvatarHeaderBlock,
  AvatarListBlock,
  BlockButtonAvatar,
  NoAvatar,
  SelectBlock,
  TitleBlock
};
