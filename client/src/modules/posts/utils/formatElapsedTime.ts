export const formatElapsedTime = (
  elapsedTime: number,
  creationDate: string
) => {
  const elapsedSeconds = Math.floor(elapsedTime);
  const elapsedMinutes = Math.floor(elapsedTime / 60);
  const elapsedHours = Math.floor(elapsedTime / 3600);

  const creationDay =
    Number(creationDate.slice(8, 9)) === 0
      ? creationDate.slice(9, 10)
      : creationDate.slice(8, 10);
  const creationMonth = Intl.DateTimeFormat("es-AR", {
    month: "short",
  }).format(new Date(creationDate.slice(5, 7)));
  const creationYear = Number(creationDate.slice(0, 4));

  const currentYear = new Date().getFullYear();

  if (elapsedSeconds === 0) {
    return "Ahora";
  } else if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s`;
  } else if (elapsedMinutes < 60) {
    return `${elapsedMinutes}min`;
  } else if (elapsedHours < 24) {
    return `${elapsedHours}h`;
  } else if (currentYear === creationYear) {
    return `${creationDay} ${creationMonth}.`;
  } else {
    return `${creationDay} ${creationMonth}. ${creationYear}`;
  }
};
