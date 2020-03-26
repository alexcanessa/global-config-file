import fs from "fs";
import path from "path";
import yaml from "js-yaml";

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

const getFilename = (name: string, extension: Extension): string => {
  if (extension === "package") {
    return "package.json";
  }

  if (extension === "empty") {
    return `${name}`;
  }

  if (extension === "config.js") {
    return `${stripExtra(name)}.${extension}`;
  }

  return `${name}.${extension}`;
};

const findConfigurationFile = (
  name: string,
  extensions: Extensions,
  root: string
): string =>
  Object.entries(extensions).reduce(
    (filename, [extension, active]: [Extension, boolean]) => {
      if (filename) {
        return filename;
      }

      if (!active) {
        return filename;
      }

      const completeFilename = getFilename(name, extension);

      // NOTE: It's necessary to join root here because of the package.json
      // scenario.
      if (fs.existsSync(path.join(root, completeFilename))) {
        return completeFilename;
      }

      return "";
    },
    ""
  );

const getObjectFromConfigFile = (filename: string): object => {
  const pathToFile = path.join(process.cwd(), filename);

  if (path.extname(filename) === ".js") {
    return require(pathToFile);
  }

  return yaml.safeLoad(fs.readFileSync(pathToFile, "utf-8"));
};

const checkExtensions = (extensions: Extensions): boolean =>
  Object.values(extensions).some(Boolean);

const globalConfigFile = (name: string, options?: Options): object => {
  const extensions = Object.assign(
    {},
    defaultExtensions,
    (options || {}).extensions
  );
  const errors = Object.assign({}, defaultErrors, (options || {}).errors);
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

  const config = getObjectFromConfigFile(path.join(root, foundFile));

  if (foundFile === "package.json") {
    return config[stripExtra(name)];
  }

  return config;
};

export default globalConfigFile;
