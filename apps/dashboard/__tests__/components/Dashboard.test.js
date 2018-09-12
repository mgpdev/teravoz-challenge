import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Component to be tested
import Dashboard from "./../../src/components/Dashboard";

describe("<Dashboard />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<Dashboard />);

      const component = wrapper.html();

      expect(component).toMatchSnapshot();
    });
  });
});
