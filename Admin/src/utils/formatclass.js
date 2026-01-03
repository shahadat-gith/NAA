export const formatClassName = (cls) => {
  if (/^\d+$/.test(cls)) return `Class ${cls}`;
  return cls.charAt(0).toUpperCase() + cls.slice(1);
};
