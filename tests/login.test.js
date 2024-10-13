import { login } from "../src/js/api/auth/login.js";
import { apiPath } from "../src/js/api/constants.js";
import { headers } from "../src/js/api/headers.js";
import * as storage from "../src/js/storage/index.js";

global.fetch = jest.fn();

jest.mock("../src/js/storage/index.js", () => ({
  save: jest.fn(),
  load: jest.fn(),
}));

describe("login function", () => {
  const email = "user@example.com";
  const password = "password123";
  const mockAccessToken = "mockUserToken";
  const mockProfile = {
    name: "John Doe",
    email: "john@example.com",
    accessToken: mockAccessToken,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Log in successfully, save the token, and return the profile without the token", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const result = await login(email, password);

    expect(fetch).toHaveBeenCalledWith(`${apiPath}/social/auth/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: headers("application/json"),
    });

    expect(storage.save).toHaveBeenCalledWith("token", mockAccessToken);
    expect(storage.save).toHaveBeenCalledWith("profile", {
      name: "John Doe",
      email: "john@example.com",
    });

    expect(result).toEqual({
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("Error if the login fails with a 401 Unauthorized", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(login(email, "wrongPassword")).rejects.toThrow("Unauthorized");

    expect(storage.save).not.toHaveBeenCalled();
  });

  it("Network error if the fetch request fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(login(email, password)).rejects.toThrow("Network Error");

    expect(storage.save).not.toHaveBeenCalled();
  });
});
