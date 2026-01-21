import { e as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate, k as renderComponent } from '../chunks/astro/server_B4R6OevK.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_BxVEuGCA.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const html = () => "<p>Terence Brasch is a senior frontend engineer and creative technologist focused on clear,\ndurable interfaces. His work sits at the intersection of product design, systems thinking,\nand real-world constraints. He builds calm, high-performing user experiences and the\nstructures that support them.</p>\n<p>He prefers small teams, direct communication, and environments where decisions are written\ndown and owned. Recent work includes in-person research spaces, retail systems, and\nfrontends designed for long-term maintainability.</p>";

				const frontmatter = {};
				const file = "C:/dev/Terence-World-Site/site/src/content/identity/bio_professional.md";
				const url = undefined;

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "About", "description": "Professional bio for Terence Brasch." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="panel"> <div class="meta">Professional Bio</div> <h1>About</h1> ${renderComponent($$result2, "Bio", Content, {})} </section> ` })}`;
}, "C:/dev/Terence-World-Site/site/src/pages/about.astro", void 0);

const $$file = "C:/dev/Terence-World-Site/site/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$About,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
