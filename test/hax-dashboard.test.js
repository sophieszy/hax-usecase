import { html, fixture, expect } from '@open-wc/testing';
import "../hax-dashboard.js";

describe("HaxDashboard test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <hax-dashboard
        title="title"
      ></hax-dashboard>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
