export const Logo = ({ size = 32, className = '' }) => {
  return (
    <img
      src="/app-icon.png"
      alt="Company Logo"
      width={size}
      height={size}
      className={`logo-img ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
};