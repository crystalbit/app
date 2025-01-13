import { fontProperty } from '@features/global/styles/fonts.styles';
import { BLACK, RGB_BLACK, WHITE } from '@features/global/styles/variables';
import styled from 'styled-components';

export const LeaderBoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  position: relative;
  top: 130px;

  @media (max-width: 1024px) {
    left: 35px;
  }

  @media (max-width: 629px) {
    left: 0;
  }
`;

export const LeaderBoardBlock = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 40px 80px;

  width: 695px;
  height: 685px;

  background: ${RGB_BLACK};
  border: 1px solid ${WHITE};

  @media (max-width: 800px) {
    padding: 15px;
    width: 600px;
    height: 600px;
  }

  @media (max-width: 690px) {
    width: 450px;
  }

  @media (max-width: 450px) {
    height: 100vh;
  }
`;

export const AttributesTabHead = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const AttributesText = styled.p<{
  flag?: boolean;
}>`
  box-sizing: border-box;
  border: 0.5px solid ${({ flag }) => (flag ? '#fe5161' : WHITE)};
  border-radius: 4px;

  padding: 4px 10px;
  color: ${({ flag }) => (flag ? '#fe5161' : WHITE)};

  margin: 0;
`;

export const TextTitle = styled.h1`
  ${fontProperty};
  font-size: 36px;
  line-height: 48px;
  text-align: center;
  text-transform: uppercase;
  margin: 0;

  color: ${WHITE};

  @media (max-width: 690px) {
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 17px;
  }
`;

export const TitleBlock = styled.div`
  display: flex;
  margin: 0;
  align-items: center;
  border-bottom: 1px solid #fff;
  padding-bottom: 11px;

  @media (max-width: 690px) {
    flex-direction: column;
    border: none;
    padding: 0;
  }
`;

export const TabsBlock = styled.div`
  display: flex;
  margin-left: 33px;
  gap: 4px;

  @media (max-width: 690px) {
    margin: 0;
  }
`;

export const Select = styled.select`
  width: 152px;
  height: 30px;
  background: ${BLACK};
  border: none;
  border-radius: 4px;
  color: white;
  padding: 4px 10px;

  &:focus-visible {
    outline: none;
  }
`;

export const Option = styled.option`
  padding: 0.5rem;

  &::part(listbox) {
    padding: 10px;
    margin-top: 5px;
    border: 1px solid red;
    border-radius: 5px;
  }
`;

export const TabsAvatarsUsers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 3px;
  gap: 3px;
  background: ${BLACK};
  border-radius: 4px;
`;

export const TabsAvatarsUsersBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  gap: 16px;
  margin-bottom: 30px;
`;

export const MainTabHeadText = styled.div<{
  flag?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 4px 10px;
  gap: 16px;
  color: ${WHITE};
  background: ${({ flag }) => (flag ? '#50535a' : '#27262D')};
  border-radius: 4px;

  cursor: pointer;

  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.04em;
  text-transform: capitalize;
`;

export const UsersListBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;

  height: 50vh;
  overflow-y: scroll;
  margin-top: 20px;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 4px;
    background: ${BLACK};
    border-radius: 600px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    height: 62px;
    background: #50535a;
    border-radius: 600px;
  }

  @media (max-width: 690px) {
    border-top: 1px solid #fff;
    padding-top: 20px;
  }

  @media (max-width: 450px) {
    height: 60%;
  }
`;

export const UsersContent = styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;

  @media (max-width: 690px) {
    width: 350px;
  }
`;

export const UserBlockInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  gap: 30px;
`;

export const UserTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  @media (max-width: 450px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const UserLeaderBlockNameProfession = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const UserTabsParams = styled.p`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  letter-spacing: -0.02em;

  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
  margin: 0;
`;

export const UserRatingName = styled.p`
  ${fontProperty};
  font-size: 14px;
  line-height: 16px;
  color: ${WHITE};
  margin: 0;
`;

export const UserRatingProfession = styled.p<{
  flag?: boolean;
}>`
  ${fontProperty};
  font-family: 'Helvetica', sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 10px;
  color: ${({ flag }) => (flag ? WHITE : 'rgba(255, 255, 255, 0.7)')};
  margin: 0;
`;

export const UserMarks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 6px 3px;
  gap: 2px;

  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;

  ${fontProperty};
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  letter-spacing: -0.02em;
  color: ${WHITE};
`;
