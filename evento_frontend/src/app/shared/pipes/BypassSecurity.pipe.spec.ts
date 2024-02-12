import { ByPassSecurityPipe } from "./BypassSecurity.pipe";

describe("SanitizePipe", () => {
  it("create an instance", () => {
    const pipe = new ByPassSecurityPipe(null);
    expect(pipe).toBeTruthy();
  });
});
