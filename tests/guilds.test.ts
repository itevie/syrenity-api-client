import { afterAll, describe, expect, test } from '@jest/globals';
import * as Syrenity from "../src/index";
import options from "./options.json";

const client = new Syrenity.Client();

describe("Testing user functions", () => {
  beforeAll(async () => {
    await client.loginWithoutWebsockets(options.token);
  });

  test("Fetch test guild", async () => {
    expect(
      await client.guild(58).fetch()
    ).toBeInstanceOf(Syrenity.Guild);
  });

  test("Test guild owner", async () => {
    expect (
      (await client.guild(58).fetch()).owner.id
    ).toBe(58)
  });

  describe("Guild modification", () => {
    let guild: Syrenity.Guild = null as unknown as Syrenity.Guild;

    beforeAll(async () => {
      guild = await client.guild(58).fetch();
    });

    test("Validate guild", () => {
      expect(guild.id).toBe(58);
    });

    test("Update name", async () => {
      const name = Math.random().toString();

      expect(
        (await guild.setName(name)).name
      ).toBe(name)
    });
  });
});