export function getCloudinaryImageUrl(
  url: string,
  width?: number,
 height?: number,
) {
  if (!url.includes("/upload/")) return url;

  const transforms = [
    "f_auto",
    "q_auto",
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    height ? "c_fill" : "",
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${transforms}/`);
}