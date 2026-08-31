// Handoff OS — Portfolio StandBy Widget
// App: Scriptable (free, App Store, no account needed)
// Install: open Scriptable → + → paste this whole file → name it "Portfolio" →
//   long-press Home Screen → Edit → Add Widget → Scriptable → choose "Portfolio" script,
//   medium size → this widget also appears when picking widgets for StandBy mode
//   (iOS StandBy pulls from your installed widgets — put phone on its side while charging).
//
// Data source: status.json, regenerated hourly by the handoff-os-uptime-sweep
// scheduled task and pushed to GitHub.

const STATUS_URL = "https://raw.githubusercontent.com/nnlevy/handoff-os-feed/main/feed/status.json";
const CACHE_PATH = "handoff-os-status-cache.json";

async function fetchStatus() {
  const fm = FileManager.local();
  const cacheFile = fm.joinPath(fm.documentsDirectory(), CACHE_PATH);
  try {
    const req = new Request(STATUS_URL);
    req.timeoutInterval = 8;
    const data = await req.loadJSON();
    fm.writeString(cacheFile, JSON.stringify(data));
    return { data, fromCache: false };
  } catch (e) {
    if (fm.fileExists(cacheFile)) {
      return { data: JSON.parse(fm.readString(cacheFile)), fromCache: true };
    }
    return { data: null, fromCache: false };
  }
}

function timeAgo(iso) {
  if (!iso) return "unknown";
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.round(diffMin / 60)}h ago`;
}

async function buildWidget() {
  const { data, fromCache } = await fetchStatus();
  const w = new ListWidget();

  if (!data) {
    w.backgroundColor = new Color("#1c1c1e");
    const t = w.addText("Handoff OS\nNo data — check connection");
    t.textColor = Color.white();
    t.font = Font.mediumSystemFont(14);
    return w;
  }

  const up = data.uptime?.up?.length ?? 0;
  const down = data.uptime?.down?.length ?? 0;
  const total = up + down;
  const allGreen = down === 0 && total > 0;

  w.backgroundColor = allGreen ? new Color("#0b3d1f") : new Color("#4a0e0e");
  w.setPadding(14, 14, 14, 14);

  const header = w.addText("QUIZBIZ PORTFOLIO");
  header.font = Font.boldSystemFont(12);
  header.textColor = new Color("#ffffff", 0.7);

  w.addSpacer(6);

  const statusLine = w.addText(allGreen ? `${up}/${total} sites up` : `${down} DOWN of ${total}`);
  statusLine.font = Font.boldSystemFont(22);
  statusLine.textColor = Color.white();

  if (!allGreen && data.uptime?.down?.length) {
    w.addSpacer(4);
    const downList = w.addText(data.uptime.down.slice(0, 3).join(", "));
    downList.font = Font.mediumSystemFont(12);
    downList.textColor = new Color("#ffb3b3");
  }

  w.addSpacer(8);
  const footer = w.addText(
    `Updated ${timeAgo(data.generated_at)}${fromCache ? " (cached)" : ""}`
  );
  footer.font = Font.systemFont(10);
  footer.textColor = new Color("#ffffff", 0.5);

  return w;
}

const widget = await buildWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
