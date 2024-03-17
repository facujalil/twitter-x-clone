export const convertDate = (elapsedTime: number, creationDate: number) => {
  const secondsElapsed = Math.round(elapsedTime);
  const minutsElapsed = Math.round(elapsedTime / 60);
  const hoursElapsed = Math.round(elapsedTime / 3600);

  const creationDay =
    Number(creationDate.toString().slice(8, 9)) === 0
      ? creationDate.toString().slice(9, 10)
      : creationDate.toString().slice(8, 10);
  const creationMonth = Intl.DateTimeFormat("es-AR", {
    month: "short",
  }).format(new Date(creationDate.toString().slice(5, 7)));
  const creationYear = Number(creationDate.toString().slice(0, 4));

  const currentYear = new Date().getFullYear();

  if (secondsElapsed === 0) {
    return "Ahora";
  } else if (secondsElapsed < 60) {
    return `${secondsElapsed}s`;
  } else if (minutsElapsed < 60) {
    return `${minutsElapsed}min`;
  } else if (hoursElapsed < 24) {
    return `${hoursElapsed}h`;
  } else if (currentYear === creationYear) {
    return `${creationDay} ${creationMonth}.`;
  } else {
    return `${creationDay} ${creationMonth}. ${creationYear}`;
  }
};
