export const baseUrl = "./";

const formatNumber = (n: number) => {
  const num: string = n.toString();
  return num[1] ? num : "0" + num;
};

export function formatDateTime(date: Date) {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  const hour: number = date.getHours();
  const minute: number = date.getMinutes();
  const second: number = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join(".") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
}
