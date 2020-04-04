import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import glob from "glob-promise";

export const defaultExtensions = {
  empty: true,
  js: true,
  "config.js": true,
  json: true,
  yml: true,
  yaml: true,
  package: true
};

const defaultErrors = {
  noConfigFound: "No configuration file found",
  noExtensions: "No extensions were found or enabled"
};

type Extension = keyof typeof defaultExtensions;
type Error = keyof typeof defaultErrors;
type Extensions = Record<Extension, boolean>;
type Options = {
  extensions?: Partial<Extensions>;
  errors?: Record<Error, string>;
  root?: string;
  quiet?: boolean;
};

const stripExtra = (name: string): string =>
  name.replace(/^\./, "").replace(/rc$/, "");

const findConfigurationFile = (
  name: string,
  extensions: Extensions,
  root: string
): string => {
  const extensionGlob = Object.entries(extensions).reduce(
    (carry, [extension, isActive]: [Extension, boolean]) => {
      if (!isActive) {
        return carry;
      }

      if (extension === "package") {
        return carry;
      }

      return carry.concat("," + extension);
    },
    ""
  );

  const foundConfig = glob
    .sync(
      root +
        `/?(.)${stripExtra(name)}?(rc)${
          extensions.empty ? "?" : "+"
        }(.{${extensionGlob}})`,
      {
        dot: true
      }
    )
    .concat(extensions.package ? path.join(root, "package.json") : undefined);

  return foundConfig[0];
};

const getObjectFromConfigFile = (filename: string): object => {
  const pathToFile = path.join(process.cwd(), filename);

  if (path.extname(filename) === ".js") {
    return require(pathToFile);
  }

  return yaml.safeLoad(fs.readFileSync(pathToFile, "utf-8"));
};

const checkExtensions = (extensions: Extensions): boolean =>
  Object.values(extensions).some(Boolean);

const globalConfigFile = (
  name: string,
  options: Options | undefined = {}
): object => {
  const extensions = Object.assign({}, defaultExtensions, options.extensions);
  const errors = Object.assign({}, defaultErrors, options.errors);
  const root = options.root || process.cwd();

  if (!checkExtensions(extensions)) {
    if (options.quiet) {
      return;
    }

    throw new Error(errors.noExtensions);
  }

  const foundFile = findConfigurationFile(name, extensions, root);

  if (!foundFile) {
    if (options.quiet) {
      return;
    }

    throw new Error(errors.noConfigFound);
  }

  const config = getObjectFromConfigFile(foundFile);

  if (foundFile === path.join(root, "package.json")) {
    return config[stripExtra(name)];
  }

  return config;
};

export default globalConfigFile;
