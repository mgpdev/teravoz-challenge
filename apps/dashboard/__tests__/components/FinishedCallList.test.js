import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// Component to be tested
import FinishedCallList from "./../../src/components/FinishedCallList";

describe("<FinishedCallList />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<FinishedCallList />);

      const component = wrapper.html();

      expect(component).toMatchSnapshot();
    });
  });
});
