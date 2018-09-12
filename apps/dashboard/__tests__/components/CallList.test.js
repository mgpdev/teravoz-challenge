import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Component to be tested
import CallList from "./../../src/components/CallList";

describe("<CallList />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(
        <CallList title="New customers calls" queue="900" />
      );
      const component = wrapper.html();

      expect(component).toMatchSnapshot();
    });
  });
});
