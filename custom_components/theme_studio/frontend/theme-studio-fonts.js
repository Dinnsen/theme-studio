// Theme Studio: adds the fonts that ship with Theme Studio and the custom
// fonts of your themes to every Home Assistant page. Loaded by the integration
// as an extra module; no dashboard resources are needed.
const ID = "theme-studio-fonts";
if (!document.getElementById(ID)) {
  const version = new URL(import.meta.url).searchParams.get("v") || "";
  const link = document.createElement("link");
  link.id = ID;
  link.rel = "stylesheet";
  link.href = `/api/theme_studio/fonts.css?v=${encodeURIComponent(version)}`;
  document.head.appendChild(link);
}
