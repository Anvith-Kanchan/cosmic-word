(() => {
  "use strict";

  // Google's documented GPT test unit. These requests render generic test creatives,
  // not live commercial ads. Replace this path only when intentionally configuring
  // an authorized Google Ad Manager inventory.
  const TEST_AD_UNIT = "/6355419/Travel/Europe/France/Paris";
  const AD_SIZE = [300, 250];
  const placements = [
    { id: "gpt-ad-hero", wrapperId: "ad-hero-wrapper" },
    { id: "gpt-ad-game", wrapperId: "ad-game-wrapper" }
  ];

  const hidePlacement = placement => {
    const wrapper = document.getElementById(placement.wrapperId);
    if (wrapper) wrapper.hidden = true;
  };

  if (window.__cosmicGptUnavailable) {
    placements.forEach(hidePlacement);
    return;
  }

  window.googletag = window.googletag || { cmd: [] };
  window.googletag.cmd.push(() => {
    const googletag = window.googletag;
    if (typeof googletag.defineSlot !== "function") {
      placements.forEach(hidePlacement);
      return;
    }

    const responsiveMapping = googletag.sizeMapping()
      .addSize([320, 0], [AD_SIZE])
      .addSize([0, 0], [])
      .build();

    const activeSlots = [];
    placements.forEach(placement => {
      const element = document.getElementById(placement.id);
      if (!element) {
        hidePlacement(placement);
        return;
      }

      const slot = googletag.defineSlot(TEST_AD_UNIT, AD_SIZE, placement.id);
      if (!slot) {
        hidePlacement(placement);
        return;
      }

      slot.defineSizeMapping(responsiveMapping).addService(googletag.pubads());
      activeSlots.push(placement);
    });

    if (!activeSlots.length) return;

    googletag.pubads().addEventListener("slotRenderEnded", event => {
      const placement = activeSlots.find(item => item.id === event.slot.getSlotElementId());
      if (!placement) return;

      const wrapper = document.getElementById(placement.wrapperId);
      if (!wrapper) return;

      if (event.isEmpty) {
        wrapper.hidden = true;
      } else {
        wrapper.dataset.adStatus = "rendered";
      }
    });

    googletag.enableServices();
    activeSlots.forEach(placement => googletag.display(placement.id));
  });
})();