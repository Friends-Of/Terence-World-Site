import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_B4R6OevK.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_BxVEuGCA.mjs';
export { renderers } from '../renderers.mjs';

const $$Fit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Fit", "description": "Where this work aligns, and where it does not." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="panel"> <div class="meta">Fit</div> <h1>Where the work fits</h1> <p>
I work best in environments that value clarity, constraints, and tangible outcomes.
      Fit is about shared pace, not just shared goals.
</p> </section> <section class="grid" style="margin-top: 24px;"> <div class="card"> <h2>Strong fit</h2> <ul> <li>Small, accountable teams with clear decision owners.</li> <li>Product and platform work grounded in real user behavior.</li> <li>Design systems that prioritize performance and readability.</li> </ul> </div> <div class="card"> <h2>Situational fit</h2> <ul> <li>Early-stage teams that need structure without heavy process.</li> <li>Legacy UI modernization when scope is tightly framed.</li> <li>Experimental interfaces that still ship within deadlines.</li> </ul> </div> <div class="card"> <h2>Poor fit</h2> <ul> <li>High-churn, meeting-heavy environments with no ownership.</li> <li>Projects driven by hype without a durable use case.</li> <li>Work that optimizes for volume rather than clarity.</li> </ul> </div> </section> ` })}`;
}, "C:/dev/Terence-World-Site/site/src/pages/fit.astro", void 0);

const $$file = "C:/dev/Terence-World-Site/site/src/pages/fit.astro";
const $$url = "/fit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Fit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
