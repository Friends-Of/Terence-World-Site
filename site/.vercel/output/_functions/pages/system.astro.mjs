import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4R6OevK.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_BxVEuGCA.mjs';
export { renderers } from '../renderers.mjs';

const $$System = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "System", "description": "How this system is intended to be read, queried, and governed." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="panel"> <div class="meta">System</div> <h1>System rules</h1> <p>
This site is organized to be navigable, fast, and legible. The structure is simple
      on purpose so that content can evolve without breaking the surface.
</p> </section> <section class="panel" style="margin-top: 24px;"> <h2>Operating principles</h2> <ul> <li>Document decisions so future work can be traced and reused.</li> <li>Prefer small surfaces with deep clarity over broad catalogs.</li> <li>Keep the interface quiet so the work stays readable.</li> <li>Ship early, then refine in public with measurable outcomes.</li> </ul> </section> <section class="panel" style="margin-top: 24px;"> <h2>How to use this space</h2> <ul> <li>Start at the project pages to understand active systems.</li> <li>Use Fit to validate alignment before engagements.</li> <li>Return here when the structure or rules change.</li> </ul> </section> ` })}`;
}, "C:/dev/Terence-World-Site/site/src/pages/system.astro", void 0);

const $$file = "C:/dev/Terence-World-Site/site/src/pages/system.astro";
const $$url = "/system";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$System,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
