import { waitForRobotToFinish } from "./waitForRobotToFinish";
export function getResultsOfBulkrun(
  crawlerService,
  bulkRunId = "78c8c0d4-6558-4f23-95f5-9a4507ca89d6"
) {
  const secondRobotId = "1f35cb33-2c3d-4889-b971-63493ae6ad21";
  return waitForRobotToFinish(
    "bulk",
    secondRobotId,
    bulkRunId,
    crawlerService,
    "3"
  );
}

export function getResultOfRobot(crawlerService) {
  const robotId = "ecb29737-7885-4521-85b9-feb7929b4d0b";
  const taskId = "03a15f5d-070f-4c47-bd4e-0523fce9c008";
  return waitForRobotToFinish("task", robotId, taskId, crawlerService);
}
