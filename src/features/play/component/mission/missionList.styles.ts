import { DARK_GREY, RGB_BLACK, TOXIC_GREEN } from '@global/styles/variables';
import styled from 'styled-components';

const MissionWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 163px;

  @media screen and (max-width: 1440px) {
    padding-left: 70px;
  }
`;

const MissionBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 974px;
  height: 430px;
  padding: 40px;
  gap: 40px;
  background: ${RGB_BLACK};
  border: 1px solid #ffffff;
  backdrop-filter: blur(20px);
`;

const MissionPlayBlock = styled.div`
  width: 100%;
`;

const TitleMissionPlay = styled.p`
  font-family: 'Play', serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0 0 10px 0;
`;

const MissionToPlay = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0 0;
  gap: 40px;
  height: 218px;
  background: #000000;
  border-radius: 4px;
`;

const MissionTableHead = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: 10px;

  font-family: 'Helvetica', serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;

  letter-spacing: 0.04em;
  text-transform: uppercase;

  color: #ffffff;
`;

const MissionContentTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  font-family: 'Helvetica', serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;

  gap: 16px;

  color: #ffffff;
`;

const ContentTitle = styled.div`
  padding: 10px 20px;
`;

const ContentProperty = styled.div`
  display: flex;
  width: 420px;
  justify-content: space-around;
  align-items: center;

  span {
    width: 30%;
  }
`;

const TitleMissionTable = styled.div`
  padding: 0 0 0 20px;
  width: 36%;
`;

const PropertyMissionTable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 0;
  gap: 60px;
`;

const List = styled.div<{
  isActive: boolean;
  isHighlighted?: boolean;
}>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;

  opacity: ${({ isActive }) => (isActive ? 1 : 0.6)};
  color: ${({ isHighlighted }) => (isHighlighted ? '#34FF61' : '')};
  background: ${({ isHighlighted }) => (isHighlighted ? '#21232B' : 'unset')};

  &:hover {
    color: ${TOXIC_GREEN};
    background: ${DARK_GREY};
  }
`;

const PlayButton = styled.button<{
  countMis?: number;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 40px;
  gap: 10px;

  width: 111px;
  height: 30px;

  background: ${({ countMis }) =>
    countMis !== 0 ? '#34FF61' : 'rgba(151, 151, 151, 0.8)'};
  border-radius: 4px;
  border: none;
  cursor: pointer;

  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;

  text-align: center;
  text-transform: uppercase;

  color: #000000;
`;

const MissionMainContent = styled.div`
  display: flex;
  width: 100%;
`;

const MobileMissionWrapper = styled.div<{
  marginTop?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 140px;
  height: 100%;

  @media screen and (min-width: 1025px) {
    display: none;
  }

  @media screen and (max-height: 705px) {
    overflow: scroll;
    height: 70vh;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }

  @media (max-width: 425px) {
    margin-top: ${({ marginTop }) => marginTop};
    height: 100%;
  }
`;

const MissionContent = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  margin: 0 0 0 15px;
`;

const TitleMobileMission = styled.p`
  font-family: 'Play', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  color: #ffffff;
`;

const AvatarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MissionWrapperBlock = styled.div`
  padding: 30px 0 0 0;
  width: 100vw;

  @media screen and (min-width: 630px) {
    padding: 30px 0 0 200px;
  }

  @media screen and (max-height: 705px) {
    padding-bottom: 60px;
  }
`;

const MissionBlockChallenge = styled.div<{
  isActive: boolean;
  isHighlighted?: boolean;
}>`
  display: inline-block;
  padding: 10px;
  gap: 20px;

  margin-right: 19px;
  width: 230px;
  height: 144px;

  background: #21232b;
  border: 1px solid #34ff61;
  border-radius: 4px;
`;

const ContentMission = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 10px;

  p {
    margin: 0;
  }
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;

  letter-spacing: 0.04em;
  text-transform: uppercase;

  color: #34ff61;
`;

const Text = styled.p``;

const BottomPlayBtnMsg = styled.div`
  position: relative;
  bottom: -90px;
  display: flex;
  align-items: center;
`;

const ErrorMsgMission = styled.p`
  font-family: Helvetica, sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  padding-left: 10px;
`;

const Block = styled.div<{
  Width?: string;
}>`
  width: ${({ Width }) => Width};
`;

const BlockMission = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const BlockTitle = styled.div`
  margin-left: 20px;
`;

export {
  AvatarWrapper,
  Block,
  BlockMission,
  BlockTitle,
  BottomPlayBtnMsg,
  Content,
  ContentMission,
  ContentProperty,
  ContentTitle,
  ErrorMsgMission,
  List,
  MissionBlock,
  MissionBlockChallenge,
  MissionContent,
  MissionContentTable,
  MissionMainContent,
  MissionPlayBlock,
  MissionTableHead,
  MissionToPlay,
  MissionWrapper,
  MissionWrapperBlock,
  MobileMissionWrapper,
  PlayButton,
  PropertyMissionTable,
  Text,
  TitleMissionPlay,
  TitleMissionTable,
  TitleMobileMission
};
