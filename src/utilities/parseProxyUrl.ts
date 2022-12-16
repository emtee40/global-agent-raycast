import { UnexpectedStateError } from "../errors";

export default (url: string, httpOrHttps: "HTTP" | "HTTPS") => {
  const urlTokens = new URL(url);

  if (urlTokens.search !== "") {
    throw new UnexpectedStateError(
      `Unsupported \`GLOBAL_AGENT.${httpOrHttps}_PROXY\` configuration value: URL must not have query.`
    );
  }

  if (urlTokens.hash !== "") {
    throw new UnexpectedStateError(
      `Unsupported \`GLOBAL_AGENT.${httpOrHttps}_PROXY\` configuration value: URL must not have hash.`
    );
  }

  if (urlTokens.protocol !== "http:" && urlTokens.protocol !== "https:") {
    throw new UnexpectedStateError(
      `Unsupported \`GLOBAL_AGENT.${httpOrHttps}_PROXY\` configuration value: URL protocol must be "http:" or "https:".`
    );
  }

  let port = 80;

  if (urlTokens.port) {
    port = Number.parseInt(urlTokens.port, 10);
  }

  let authorization = null;

  if (urlTokens.username && urlTokens.password) {
    authorization = urlTokens.username + ":" + urlTokens.password;
  } else if (urlTokens.username) {
    authorization = urlTokens.username;
  }

  return {
    authorization,
    hostname: urlTokens.hostname,
    port,
  };
};
