import type { Context } from "hono";

const OWNER = "dioneapp";
const REPO = "dioneapp";

const PATTERNS = {
    windows: /^Dione-.*-Installer-Windows\.exe$/i,
    mac: /^Dione-.*-Installer-Mac\.dmg$/i,
    linuxAppImage: /^Dione-.*-Installer-Linux\.AppImage$/i,
    linuxDeb: /^Dione-.*-Installer-Linux\.deb$/i,
    linuxRpm: /^Dione-.*-Installer-Linux\.rpm$/i,
} as const;

type OsKey = keyof typeof PATTERNS;

type GitHubAsset = {
    name?: string | null;
    browser_download_url?: string;
};

type GitHubRelease = {
    assets?: GitHubAsset[];
};

export async function downloadLatestVersion(
    c: Context,
    os: OsKey,
): Promise<{ stream: ReadableStream<Uint8Array>; fileName: string }> {
    const GITHUB_TOKEN = c.env.GITHUB_TOKEN;

    const relRes = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "dione-installer-proxy",
                ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
                "X-GitHub-Api-Version": "2022-11-28",
            },
            cache: "no-store",
        },
    );

    if (!relRes.ok) {
        throw new Error("Failed to fetch latest release metadata");
    }

    const release = (await relRes.json()) as GitHubRelease;

    if (!release.assets || !Array.isArray(release.assets)) {
        throw new Error("No assets in latest release");
    }

    const pattern = PATTERNS[os];

    const asset = release.assets.find(
        (a) => typeof a.name === "string" && pattern.test(a.name!),
    );

    if (!asset || !asset.browser_download_url) {
        throw new Error(`Installer not found for ${os}`);
    }

    const binRes = await fetch(asset.browser_download_url, {
        headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
    });

    if (!binRes.ok || !binRes.body) {
        throw new Error("Failed to download installer");
    }

    const fileName = asset.name ?? `Dione-Installer-${os}.bin`;

    return {
        stream: binRes.body as ReadableStream<Uint8Array>,
        fileName,
    };
}
