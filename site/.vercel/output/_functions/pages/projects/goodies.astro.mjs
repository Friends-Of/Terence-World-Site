import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_B4R6OevK.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_BxVEuGCA.mjs';
export { renderers } from '../../renderers.mjs';

const $$Goodies = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Goodies Snack Shop", "description": "Brand, operations, and systems thinking under real retail constraints." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="panel"> <div class="meta">Project</div> <h1>Goodies Snack Shop</h1> <p>
Goodies is a small retail system where brand, operations, and technology meet. It is a
      live testbed for inventory, service flow, and physical-digital coordination.
</p> </section> <section class="grid" style="margin-top: 24px;"> <div class="card"> <h2>Focus</h2> <ul> <li>Operational clarity for staff and customers.</li> <li>Inventory decisions tied to real usage data.</li> <li>Brand presence that stays human and local.</li> </ul> </div> <div class="card"> <h2>Constraints</h2> <ul> <li>Retail margins require tight feedback loops.</li> <li>Physical space drives UX and system design.</li> <li>Systems must work under peak and off-peak load.</li> </ul> </div> <div class="card"> <h2>Signals</h2> <ul> <li>Daily sales rhythm and product rotation.</li> <li>Operational notes captured alongside receipts.</li> <li>Small experiments with immediate user feedback.</li> </ul> </div> </section> ` })}`;
}, "C:/dev/Terence-World-Site/site/src/pages/projects/goodies.astro", void 0);

const $$file = "C:/dev/Terence-World-Site/site/src/pages/projects/goodies.astro";
const $$url = "/projects/goodies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Goodies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
