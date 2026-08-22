# Drawings

The drawing layer supports horizontal lines, vertical lines, trend lines and rectangles using the same consumer-facing definitions as built-ins. Drawings are controlled and serializable. Selection, point editing, deletion, visibility, locking and undo/redo are emitted through `MarketChart` callbacks.

When OHLC data is supplied, new and edited points snap to a nearby open, high, low or close within the configurable `snapDistance`. Set `snapToOhlc={false}` for unrestricted price placement.
