interface Props {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  className?: string;
}

export default function T({ children, as, style, className }: Props) {
  const TagName = (as ?? 'span') as React.ElementType;
  return (
    <TagName data-translatable="true" className={className} style={style}>
      {children}
    </TagName>
  );
}
