export const CRAWLER_CONFIG = {
  urbanite: {
    robotId: "e7343656-2f63-4078-bf8c-df7ea0835a80",
    inputUrl: "https://www.urbanite.net/leipzig/events/",
    inputValue: new Date(),
    secondRobotId: "1f35cb33-2c3d-4889-b971-63493ae6ad21",
  },
  leipzig: {
    robotId: "4fdc80d2-0187-4337-acba-aab100b74245",
    inputUrl:
      "https://www.leipzig.de/searchresults?mksearch%5Bcategory%5D=&mksearch%5Bdate_from%5D=20.12.2023&mksearch%5Bdate_to%5D=20.12.2023&mksearch%5Bterm%5D=&mksearch%5Bsubmit%5D=Veranstaltung+suchen&mksearch%5Bsubmitted%5D=1",
    inputValue: new Date(),
    secondRobotId: "4fa8ca19-18e5-4971-9e1b-a86ecd45aa57",
  },
  ifz: {
    robotId: "ecb29737-7885-4521-85b9-feb7929b4d0b",
    inputUrl: "https://ifz.me/",
    inputValue: null,
    secondRobotId: "1f0b7146-3dd2-4d29-a5cc-305eed6d198b",
  },
};
