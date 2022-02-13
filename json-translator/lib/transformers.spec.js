const transformers = require("./transformers");

describe("transformers", () => {
  describe("dry run", () => {
    it("prepends zz_ to all strings", async () => {
      const value = "foo";
      const tr = transformers.dryRun();
      const output = await tr(value);
      expect(output).toBe("zz_foo");
    });
  });

  describe("google", () => {
    it("requires an from parameter", () => {
      expect(() => transformers.google({})).toThrow(
        "Missing required parameter: from"
      );
    });

    it("successfully translates a string", async () => {
      const value = "The quick brown fox ate the prawn crackers from the bin.";
      const tr = transformers.google({
        from: "en",
        to: "fr",
      });
      expect(await tr(value)).toBe(
        "Le renard brun rapide a mangé les craquelins de crevettes du bac."
      );
    });

    it("preserves HTML entities correctly", async () => {
      const valueWithEntities = "Harold &amp; &quot;Kumar&quot;";
      const tr = transformers.google({
        from: "en",
        to: "en",
        preserveEntities: true,
      });
      expect(await tr(valueWithEntities)).toBe(valueWithEntities);
    });

    it("passes through HTML entities by default", async () => {
      const valueWithEntities = "Harold &amp; &quot;Kumar&quot;";
      const tr = transformers.google({
        from: "en",
        to: "en",
      });
      expect(await tr(valueWithEntities)).toBe('Harold & "Kumar"');
    });
  });
  describe("bing", () => {
    const apiKey = process.env.BING_API_KEY;

    it("requires an lang parameter", () => {
      expect(() => transformers.bing({ apiKey: "abc123" })).toThrow(
        "Missing required parameter: from"
      );
    });
    it("requires an apiKey parameter", () => {
      expect(() => transformers.bing({ lang: "fr" })).toThrow(
        "Missing required parameter: apiKey"
      );
    });
    it("translates some text", async () => {
      const value = "Have you ever been to the space station?";
      const tr = transformers.bing({ apiKey, from: "en", to: "ru" });
      expect(await tr(value)).toBe(
        "Вы когда-нибудь были на космической станции?"
      );
    });

    it("preserves HTML entities correctly", async () => {
      const valueWithEntities = "Harold &amp; &quot;Kumar&quot;";
      const tr = transformers.bing({
        apiKey,
        from: "en",
        to: "en",

        preserveEntities: true,
      });
      expect(await tr(valueWithEntities)).toBe(valueWithEntities);
    });

    it("errors correctly with too much text", async () => {
      const value = Array(10e4).fill("lorem").join("");
      const tr = transformers.bing({
        apiKey,
        from: "en",
        to: "en",
      });
      expect(tr(value)).rejects.toEqual(expect.any(Error));
    });
  });
});
