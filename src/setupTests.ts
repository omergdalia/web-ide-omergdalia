// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import ohm from "ohm-js";
import {
  isErr,
  Result,
  Err,
  Ok,
  isOk,
} from "@davidsouther/jiffies/lib/esm/result";
import "@testing-library/jest-dom";
import { i18n } from "@lingui/core";
import { en } from "make-plural/plurals";
import { messages } from "./locales/en/messages";

i18n.load("en", messages);
i18n.loadLocaleData({
  en: { plurals: en },
});
i18n.activate("en");

interface CustomMatchers<R = unknown, T = unknown> {
  toBeOk(result: T): R;
  toBeErr(result: T): R;
}

interface OhmMatchers<R = unknown> {
  toHaveSucceeded(): R;
  toHaveFailed(message: string): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R, T = {}>
      extends CustomMatchers<R, T>,
        OhmMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers, OhmMatchers {}
  }
}

expect.extend({
  toBeErr<R, T = {}>(result: Result<R>, expected: Err<T>) {
    if (isOk(result)) {
      return {
        pass: false,
        message: () => `Expected Err(${expected}), got Ok(${Err(result)})`,
      };
    } else {
      expect(Err(result)).toMatchObject(Err(expected));
    }
    return { pass: true, message: () => `Err(${Err(result)}) is expected` };
  },
  toBeOk<R, T = {}>(result: Result<R>, expected: Ok<T>) {
    if (isErr(result)) {
      return {
        pass: false,
        message: () => `Expected Ok(${expected}), got Err(${Err(result)})`,
      };
    } else {
      expect(Ok(result)).toMatchObject(Ok(expected));
    }
    return { pass: true, message: () => `Ok(${Ok(result)}) is expected` };
  },
  toHaveSucceeded(match: ohm.MatchResult) {
    if (match.succeeded()) {
      return { pass: true, message: () => "Match succeeded" };
    } else {
      return { pass: false, message: () => match.message ?? "Match failed" };
    }
  },
  toHaveFailed(match: ohm.MatchResult, message: string) {
    expect(match.failed()).toBe(true);
    expect(match.shortMessage).toBe(message);
    return {
      pass: true,
      message: () => "Failed to parse with correct message",
    };
  },
});
