import Ethereum from '@api/etheriumWeb3';

const polygonGas = async () => {
  const gas = await Ethereum.getPolygonGasValue();
  return (gas.fastgaspricegwei * 1000000000).toString();
};

export { polygonGas };
