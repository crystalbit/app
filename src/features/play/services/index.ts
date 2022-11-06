export const getTransportName = async ({
  gears,
  selectedGearIdx,
  callback
}: {
  gears: {
    transports: Record<string, any>[];
  };
  selectedGearIdx: number;
  callback: (data: { name: string; loading: boolean }) => unknown;
}) => {
  const response = await fetch(gears.transports[selectedGearIdx].src);
  if (response.url.includes('.jpg')) return;
  const data = await response.json();
  callback({ name: data.name, loading: false });
};
