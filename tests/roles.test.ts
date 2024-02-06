import {afterAll, describe, expect, test} from '@jest/globals';
import * as Syrenity from "../src/index";
import options from "./options.json";

const client = new Syrenity.Client();

describe("Testing user functions", () => {
  beforeAll(async () => {
    await client.loginWithoutWebsockets(options.token);
  });

  test("Get role", async () => {
    expect(
      await client.guild(58).role(932).fetch()
    ).toBeInstanceOf(Syrenity.Role)
  });
});