import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Component to be tested
import CallItem from "./../../src/components/CallItem";

describe("<CallItem />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(
        <CallItem number="(11) 9986-5645" time="11:50" />
      );
      const component = wrapper.html();

      expect(component).toMatchSnapshot();
    });
  });
});
