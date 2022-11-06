import { fontProperty } from '@features/global/styles/fonts.styles';
import { BLACK, RGB_BLACK, WHITE } from '@features/global/styles/variables';
import styled from 'styled-components';

export const InfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  position: relative;
  top: 130px;

  @media screen and (max-width: 1100px) {
    left: 40px;
  }

  @media screen and (max-width: 629px) {
    left: 0;
  }
`;

export const InfoBlock = styled.div`
  display: flex;
  align-items: center;

  gap: 200px;

  width: 960px;
  height: 170px;

  background: ${RGB_BLACK};

  @media screen and (max-width: 1020px) {
    width: 425px;
    height: 220px;
  }
`;

export const UserBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  gap: 60px;
  padding: 30px 60px 60px;

  width: 100%;

  @media screen and (max-width: 1020px) {
    gap: 20px;
    padding: 0 0 0 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  @media screen and (max-width: 410px) {
    padding: 0 0 0 60px;
  }
`;

export const UserBlockImgName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 20px;

  @media screen and (max-width: 1020px) {
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const UserImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;

  width: 80px;
  height: 80px;

  background: #21232b;
  border-radius: 200px;
`;

export const UserName = styled.div`
  display: flex;
  align-items: center;
  gap: 43px;

  svg {
    cursor: pointer;
  }

  @media screen and (max-width: 1020px) {
    gap: 20px;
  }
`;

export const Name = styled.p`
  ${fontProperty};
  font-size: 36px;
  line-height: 48px;
  text-align: center;
  text-transform: uppercase;

  color: ${WHITE};

  @media screen and (max-width: 1020px) {
    font-size: 30px;
  }

  @media screen and (max-width: 410px) {
    font-size: 24px;
  }
`;

export const UserSocialBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0;
  gap: 16px;

  width: 76px;
  height: 30px;

  @media screen and (max-width: 425px) {
    position: absolute;
    right: 20px;
  }
`;

export const CircleSocialIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 12px;

  width: 30px;
  height: 30px;
  background: #21232b;
`;

export const TabsBlock = styled.div`
  display: flex;
  margin-top: 27px;
  width: 960px;

  @media screen and (max-width: 1020px) {
    justify-content: center;
  }

  @media screen and (max-width: 425px) {
    width: 567px;
    justify-content: space-evenly;
  }
`;

export const UserTabHead = styled.div<{
  active?: string;
  flag?: boolean;
  isActive?: boolean;
  index?: number;
}>`
  cursor: pointer;
  //padding: ${({ index }) => (index === 0 ? '0 100px 7px 0' : '0 0 7px 0')};

  color: ${({ active }) => active ?? ''};

  width: 150px;
  text-align: center;
  border-bottom: ${({ flag }) => (flag ? ' 2px solid' : '')};
`;

export const TabsText = styled.p`
  ${fontProperty};
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  margin: 0;
`;

export const StatisticBlock = styled.div`
  width: 960px;

  @media screen and (max-width: 1020px) {
    width: 425px;
  }
`;

export const StatisticBlockLandsAvatar = styled.div`
  padding: 30px 20px;
  gap: 20px;
  height: 500px;
  background: ${RGB_BLACK};
  border-top: 1px solid #8f8f93;
`;

export const StatisticCounter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  padding: 3px;
  gap: 3px;

  background: ${BLACK};
  border-radius: 4px;
`;

export const ChainTabHead = styled.div`
  width: 457px;
  height: 24px;
  text-align: center;
  border-radius: 4px;
  display: flex;
  justify-content: center;

  cursor: pointer;

  @media screen and (max-width: 1020px) {
    width: fit-content;
  }
`;

export const ChainTabHeadText = styled.div<{
  flag?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  gap: 8px;

  width: 457px;

  border-radius: 4px;
  background: ${({ flag }) => (flag ? '#50535a' : '#000')};

  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.04em;
  text-transform: capitalize;

  color: ${WHITE};

  @media screen and (max-width: 1020px) {
    width: 151px;
  }
`;

export const ChainLandBlock = styled.div`
  margin-top: 20px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;

  width: 121px;
  overflow-y: scroll;
  height: 48vh;

  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 425px) {
    margin-left: 10px;
    width: 160px;
  }
`;

export const StatisticAvatars = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  gap: 10px;

  width: 100%;
`;

export const BlockLandNameIcon = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  svg {
    cursor: not-allowed;
  }
`;

export const StatisticLands = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  gap: 10px;

  width: 100%;
`;

export const LandImg = styled.div<{
  url?: string;
}>`
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background-image: url(${({ url }) => url});
  background-size: contain;
  background-repeat: no-repeat;

  @media screen and (max-width: 425px) {
    width: 37px;
    height: 37px;
  }
`;

export const LandName = styled.p`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 11px;

  color: ${WHITE};

  @media screen and (max-width: 425px) {
    font-size: 14px;
  }
`;
