export const getGradient = (ctx: any, chartArea: any, colorStops: any) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(({ stop, color }: any) => {
    gradient.addColorStop(stop, color);
  });
  return gradient;
};
