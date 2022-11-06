import styled, { css } from 'styled-components';

const TabsBlock = styled.div<{
  flag?: boolean;
}>`
  position: fixed;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(25px);
  background: ${({ flag }) =>
    flag
      ? 'no-repeat url(/UIParts/mission_avatar.png)'
      : 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(155.38deg, #474645 -0.38%, #362100 92.08%)'};
  background-size: 100% 100%;
`;

const TabsWrapper = styled.div`
  display: flex;
  background: rgba(33, 35, 43, 0.6);
  width: 100%;
  height: 40px;

  @media (max-width: 629px) {
    position: relative;
    top: 60px;
  }
`;

const TabList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const TabHead = styled.div<{
  active?: string;
  flag?: boolean;
  isActive?: boolean;
}>`
  cursor: pointer;
  font-family: 'Helvetica', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;

  text-decoration: ${({ flag }) => (flag ? 'underline' : 'unset')};
  text-underline-offset: ${({ flag }) => (flag ? '10px' : 'unset')};
  color: ${({ active }) => active ?? ''};

  ${({ isActive }) => {
    if (!isActive) {
      return css`
        cursor: not-allowed;
        opacity: 0.4;
      `;
    }
  }}
`;

export { TabHead, TabList, TabsBlock, TabsWrapper };
