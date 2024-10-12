import { login } from "../src/js/api/auth/login.js";
import { save } from "../src/js/storage/save.js";
import { apiPath } from "../src/js/api/constants.js";
import { headers } from "../src/js/api/headers.js";

globalThis.fetch = jest.fn();

jest.mock("../src/js/storage/save.js", () => ({
  save: jest.fn(),
}));

describe("login function", () => {
  const email = "john@example.com";
  const password = "password123";
  const mockAccessToken = "mockAccessToken";

  beforeEach(() => {
    fetch.mockClear();
    save.mockClear();
  });

  it("should log in successfully and save the access token", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: mockAccessToken }),
    });

    const result = await login(email, password);

    expect(fetch).toHaveBeenCalledWith(`${apiPath}/social/auth/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: headers("application/json"),
    });

    expect(save).toHaveBeenCalledWith("token", mockAccessToken);

    expect(result).toEqual({});
  });
});
