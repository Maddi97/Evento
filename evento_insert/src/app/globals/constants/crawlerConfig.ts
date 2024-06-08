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
      "https://www.leipzig.de/searchresults?mksearch%5Bcategory%5D=412&mksearch%5Bdate_from%5D=10.06.2024&mksearch%5Bdate_to%5D=10.06.2024&mksearch%5Bterm%5D=&mksearch%5Bsubmit%5D=Veranstaltung+suchen&mksearch%5Bsubmitted%5D=1",
    inputValue: new Date(),
    secondRobotId: "8e1af8a9-9c60-428f-a1cc-f1e27e4c4eb4",
    categories: [164, 152, 116, 407, 412], // 164: Bühne, 152: Sport, 116: Wissenschaft, 407: Lesung, 412: Konzert
  },
  ifz: {
    robotId: "ecb29737-7885-4521-85b9-feb7929b4d0b",
    inputUrl: "https://ifz.me/",
    inputValue: null,
    secondRobotId: "1f0b7146-3dd2-4d29-a5cc-305eed6d198b",
  },
  meineFlohmaerkte: {
    robotId: "9865ebe8-b3f7-4473-be43-4155d9dadc54",
    inputUrl: "https://meine-flohmarkt-termine.de/ort/leipzig",
    inputValue: null,
    secondRobotId: "7c61ab48-b42a-4552-ba4b-4779092aa10d",
  },
  rausgegangen: {
    robotId: "977a9438-4f60-41fd-8d90-06890b217b64",
    inputUrl: "https://rausgegangen.de/en/leipzig/category/party/",
    inputValue: null,
    secondRobotId: "fe00c758-1057-4fc2-8dfe-b53802f359e7",
  },
};
