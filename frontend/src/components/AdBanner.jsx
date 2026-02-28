import { useEffect } from "react";

type Props = {
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: boolean;
};

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({
  slot,
  style = { display: "block" },
  format = "auto",
  responsive = true,
}: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-3581358132812297"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}