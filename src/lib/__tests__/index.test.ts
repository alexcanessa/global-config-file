import path from "path";
import globalConfigFile, { defaultExtensions } from "../";

const root = path.relative(process.cwd(), __dirname);
const deactivatedExtensions = Object.keys(defaultExtensions).reduce(
  (carry, extension) => ({
    ...carry,
    [extension]: false
  }),
  {}
);

describe("globalConfigFile function", () => {
  it("loads a .json file", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, json: true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("loads a .yml file", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, yml: true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("loads a .yaml file", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, yaml: true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("loads an extension-free file", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, empty: true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("loads a .js file", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, js: true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("loads a .config.js file", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, "config.js": true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("loads the package.json", () => {
    const config = globalConfigFile(".examplerc", {
      extensions: { ...deactivatedExtensions, package: true },
      root
    });

    expect(config).toMatchSnapshot();
  });
  it("throws an error if no files are found", () => {
    const globalConfigFileTest = globalConfigFile.bind(
      null,
      "nonExistingFile",
      {
        extensions: { ...deactivatedExtensions, json: true },
        root
      }
    );

    expect(globalConfigFileTest).toThrowErrorMatchingSnapshot();
  });
  it("throws an error if all falsy extensions are passed to options", () => {
    const globalConfigFileTest = globalConfigFile.bind(null, ".examplerc", {
      extensions: deactivatedExtensions,
      root
    });

    expect(globalConfigFileTest).toThrowErrorMatchingSnapshot();
  });
  it("does not throw an error if no files are found when quiet=true", () => {
    const globalConfigFileTest = globalConfigFile.bind(
      null,
      "nonExistingFile",
      {
        extensions: { ...deactivatedExtensions, json: true },
        root,
        quiet: true
      }
    );

    expect(globalConfigFileTest).not.toThrow();
  });
  it("does not throw an error if all falsy extensions are passed to options when quiet=true", () => {
    const globalConfigFileTest = globalConfigFile.bind(null, ".examplerc", {
      extensions: deactivatedExtensions,
      root,
      quiet: true
    });

    expect(globalConfigFileTest).not.toThrow();
  });
});
