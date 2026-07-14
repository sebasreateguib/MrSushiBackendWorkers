// ===== Carrusel de banners superior =====
const arrowStyle = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  backgroundColor: 'transparent', color: 'white',
  border: 'none', padding: '15px 10px', fontSize: '2rem',
  cursor: 'pointer', zIndex: 10
};

function BannerCarousel({ banners, currentSlide, onPrev, onNext }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: banners[currentSlide].height,
      backgroundColor: '#000',
      overflow: 'hidden',
      transition: 'height 0.5s ease-in-out'
    }}>
      <img
        src={banners[currentSlide].src}
        alt="Promoción Mr Sushi"
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' }}
      />
      <button onClick={onPrev} style={{ ...arrowStyle, left: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4L9 11L4.5 7.5L9 4Z" fill="white"></path>
        </svg>
      </button>
      <button onClick={onNext} style={{ ...arrowStyle, right: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
          <path d="M9 4L9 11L4.5 7.5L9 4Z" fill="white"></path>
        </svg>
      </button>
    </section>
  );
}

export default BannerCarousel;
