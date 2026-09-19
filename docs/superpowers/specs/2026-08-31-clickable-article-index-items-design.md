# Clickable article index items

## Goal

Make every article item on the Articles index a single, predictable navigation target. A visitor may activate the item from its title, description, tags, date, arrow, or surrounding whitespace without encountering duplicate links to the same destination.

## Interaction design

Each rendered article item contains one React Router `Link` that fills the complete row. The title, description, tags, publication date, and directional arrow remain visually unchanged inside that link.

The link's accessible name is derived from the visible article title rather than the complete item contents. Keyboard users encounter one focus stop per article, and the existing focus treatment applies around the complete row. Pointer and touch users receive the same navigation behavior anywhere within the item.

## States

- Hovering or focusing any part of an item applies the established interactive title and arrow treatment.
- Keyboard activation uses the link's native Enter behavior.
- The article index retains normal client-side navigation and browser-history behavior.
- Empty-state behavior is unchanged.

## Responsive behavior

The existing mobile, medium, and desktop layouts remain intact. The click target follows the complete rendered row at every width without adding overflow or changing the placement of the date and arrow.

## Accessibility

- Use one semantic link rather than click handlers on the article container.
- Keep a single keyboard stop for each article item.
- Preserve a visible focus indicator around the complete item.
- Keep the decorative arrow hidden from assistive technology.
- Ensure the link's accessible name matches the visible title.

## Acceptance criteria

- Clicking or tapping anywhere inside an article item opens that article.
- The arrow activates the same article destination.
- Each item exposes exactly one link and one keyboard focus stop.
- The link has the visible article title as its accessible name.
- Hover and focus feedback are apparent across the item without changing the approved layout.
- Client-side navigation, Back and Forward history, mobile layout, dates below tags, and divider continuity remain unchanged.
- Article index tests cover activation from outside the title and verify the single-link structure.
