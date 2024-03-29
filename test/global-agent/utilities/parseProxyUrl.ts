import test from "ava";
import parseProxyUrl from "../../../src/utilities/parseProxyUrl";

test("extracts hostname", (t) => {
  t.is(parseProxyUrl("http://0.0.0.0", "HTTP").hostname, "0.0.0.0");
});

test("extracts port", (t) => {
  t.is(parseProxyUrl("http://0.0.0.0:3000", "HTTP").port, 3_000);
});

test("extracts authorization", (t) => {
  t.is(
    parseProxyUrl("http://foo:bar@0.0.0.0", "HTTP").authorization,
    "foo:bar"
  );
});

test('throws an error if protocol is not "http:"', (t) => {
  const error = t.throws(() => {
    parseProxyUrl("ws://0.0.0.0:3000", "HTTP");
  });

  t.is(
    error?.message,
    'Unsupported `GLOBAL_AGENT.HTTP_PROXY` configuration value: URL protocol must be "http:" or "https:".'
  );
});

test("throws an error if query is present", (t) => {
  const error = t.throws(() => {
    parseProxyUrl("http://0.0.0.0:3000/?foo=bar", "HTTP");
  });

  t.is(
    error?.message,
    "Unsupported `GLOBAL_AGENT.HTTP_PROXY` configuration value: URL must not have query."
  );
});

test("throws an error if hash is present", (t) => {
  const error = t.throws(() => {
    parseProxyUrl("http://0.0.0.0:3000/#foo", "HTTP");
  });

  t.is(
    error?.message,
    "Unsupported `GLOBAL_AGENT.HTTP_PROXY` configuration value: URL must not have hash."
  );
});
