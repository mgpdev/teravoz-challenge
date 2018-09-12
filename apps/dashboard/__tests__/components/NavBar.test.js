import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Component to be tested
import NavBar from "./../../src/components/NavBar";

describe("<NavBar />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<NavBar />);

      const component = wrapper.html();

      expect(component).toMatchSnapshot();
    });
  });
});
