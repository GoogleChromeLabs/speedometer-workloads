const path = require("path");
const { findDirectories, executeScriptSync } = require("./utils");

const buildScripts = {
  static: "build:static",
};

/**
 * build
 * 
 * Function to build all apps, by scanning the apps folder for nested apps to run a build script on.
 */
async function build() {
  // We're looking for package.json files, to know what directory we should run the build script in.
  const target = "package.json";
  // We're starting from the root directory of the monorepo.
  const start = "../../../";
  // Name of the root directory - "aurora-workloads".
  const root = path.basename(path.resolve(start));
  // build to run (build, build:static, ect..).
  const type = process.env.TYPE ?? 'static';
  const script = buildScripts[type];

  const directories = await findDirectories({ start, target, root });

  const reports = [];

  for (const directory of directories) {
    const result = executeScriptSync({ script, directory });
    reports.push(result);
  }

  console.log("*********************************");
  console.log("The following apps have been attempted to build:");
  reports.forEach(({ dir, status }) => {
    status === "success" ? console.log(`🟢 ${dir}`) : console.log(`🔴 ${dir}`);
  });
  console.log("*********************************");
  console.log("Bye! 👋");
  console.log("*********************************");
}

build();
