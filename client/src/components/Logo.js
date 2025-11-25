const Logo = ({ size = 40, showText = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Logo Image */}
      <img 
        src="https://i.postimg.cc/BZkG1MmW/d5a36513-bff6-41ce-8979-fc759896e13f-1762935348-removebg-preview.png" 
        alt="ChainCommerce Logo" 
        width={size} 
        height={size}
        style={{ 
          objectFit: 'contain',
          display: 'block'
        }}
      />
      
      {showText && (
        <span style={{
          fontSize: size * 0.5,
          fontWeight: '900',
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
          fontFamily: 'Space Grotesk, Poppins, sans-serif'
        }}>
          ChainCommerce
        </span>
      )}
    </div>
  );
};

export default Logo;
