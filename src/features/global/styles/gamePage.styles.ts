import styled from 'styled-components';

const GameUINavbar = styled.div`
  padding: 15px;
  min-height: 40px;
  background-color: black;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100vw;
  max-width: 100vw;
`;

const GameNavBarLink = styled.a`
  color: inherit;
  font-size: 20px;
  text-decoration: none;
  font-weight: bold;
`;

export { GameNavBarLink, GameUINavbar };
