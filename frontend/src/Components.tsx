import React, { forwardRef } from "react";
import { Button as AntdButton, Typography } from "antd";

const { Text: AntdText, Link: AntdLink } = Typography;

export const Container: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <div
    style={{
      ...style,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

export const Card = forwardRef<HTMLDivElement, React.PropsWithChildren<{ style?: React.CSSProperties }>>(
  ({ children, style }, ref) => (
    <div
      ref={ref}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px",
        margin: "12px",
        borderRadius: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 0 18px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  )
);

export const Bubble: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <div
    style={{
      ...style,
      padding: "6px",
      margin: "6px",
      borderRadius: "8px",
      boxShadow: "0 0 6px rgba(0, 0, 0, 0.25)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}
  >
    {children}
  </div>
);

export const fontFamilies = [
  "Times New Roman",
  "Times",
  "Nimbus Roman No9 L",
  "Liberation Serif",
  "FreeSerif",
  "Hoefler Text",
  "Microsoft YaHei",
  "Hiragino Sans GB",
  "WenQuanYi Micro Hei",
  "STHeiti",
  "sans-serif",
];

export const Text: React.FC<
  React.PropsWithChildren<{ style?: React.CSSProperties; size?: string; editable?: any; copyable?: any }>
> = ({ children, style, size, editable, copyable }) => {
  switch (size) {
    case "small":
      size = "12px";
      break;
    case "medium":
      size = "18px";
      break;
    case "large":
      size = "24px";
      break;
    case "title":
      size = "36px";
      break;
    case "extra":
      size = "80px";
      break;
    default:
      size = "18px";
  }
  return <AntdText style={{ ...style, fontSize: size }} editable={editable} copyable={copyable}>{children}</AntdText>;
};

export const Link: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties; onClick?: () => void; danger?: boolean }>> = ({
  children,
  style,
  onClick,
  danger,
}) => (
  <AntdLink type={danger ? "danger" : undefined} style={{ ...style, fontSize: "12px" }} onClick={onClick}>
    {children}
  </AntdLink>
);

export const Button: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties; onClick?: () => void }>> = ({
  children,
  style,
  onClick,
}) => (
  <AntdButton className="need-interaction" style={{ ...style, fontSize: "18px", height: "40px", cursor: "pointer" }} onClick={onClick}>
    {children}
  </AntdButton>
);

export const Scroll: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <div
    className="need-interaction"
    style={{
      ...style,
      height: "100%",
      width: "100%",
      overflowY: "scroll",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(0, 0, 0, 0.25) rgba(255, 255, 255, 0)",
    }}
  >
    {children}
  </div>
);

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  parentRef?: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  items: { label: string; onClick: () => void }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, parentRef, onClose, items }) => {
  if (!position) return null;

  let top = position.y;
  let left = position.x;

  if (parentRef?.current) {
    const rect = parentRef.current.getBoundingClientRect();
    top = position.y - rect.top;
    left = position.x - rect.left;
  }

  return (
    <>
      <div className="need-interaction" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999 }} />
      <div
        className="need-interaction"
        style={{
          position: "absolute",
          top,
          left,
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          padding: "4px 0",
          minWidth: "100px",
          pointerEvents: "auto",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ padding: "6px 12px", cursor: "pointer", fontSize: "14px" }}
            onClick={() => { item.onClick(); onClose(); }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
};
