export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const fileId =
    searchParams.get("id") || "16Yg2QXYHFpx5Ayrk1IQtRsiqywUB8GbV";
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "b93b4880-424f-4de8-b031-5e607a25cd89";

  const driveStreamUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(
    fileId
  )}&export=download&confirm=t&uuid=${uuid}`;

  try {
    const upstream = await fetch(driveStreamUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (!upstream.ok || !upstream.body) {
      return Response.redirect(driveStreamUrl, 302);
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.android.package-archive");
    headers.set(
      "Content-Disposition",
      'attachment; filename="Jiyarul Store.apk"'
    );
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (e) {
    return Response.redirect(driveStreamUrl, 302);
  }
}