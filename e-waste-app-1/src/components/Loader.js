// import React from 'react';

// const Loader = ({ size = 'medium' }) => {
//   const getLoaderClass = () => {
//     switch (size) {
//       case 'small': return 'loader-small';
//       case 'large': return 'loader-large';
//       default: return 'loader-medium';
//     }
//   };

//   return (
//     <div className="loader-container">
//       <div className={`loader ${getLoaderClass()}`}>
//         {/* ♻ Unicode recycle logo */}
//         <span className="loader-icon" role="img" aria-label="recycle">
//           ♻
//         </span>
//       </div>
//     </div>
//   );
// };

// export const LoaderOverlay = () => (
//   <div className="loader-overlay">
//     <Loader size="large" />
//   </div>
// );

// export const PageLoader = () => (
//   <div className="page-loader">
//     <Loader size="large" />
//   </div>
// );

// export default Loader;

import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const getLoaderClass = () => {
    switch (size) {
      case 'small': return 'loader-small';
      case 'large': return 'loader-large';
      default: return 'loader-medium';
    }
  };

  return (
    <div className="loader-container">
      <div className={`loader ${getLoaderClass()}`}>
        <span className="loader-icon" role="img" aria-label="recycle">
          ♻
        </span>
      </div>
    </div>
  );
};

export const LoaderOverlay = () => (
  <div className="loader-overlay">
    <Loader size="large" />
  </div>
);

export const PageLoader = () => (
  <div className="page-loader">
    <Loader size="large" />
  </div>
);

export default Loader;




// import React from 'react';

// const Loader = ({ size = 'medium', text = 'Loading' }) => {
//   const getLoaderClass = () => {
//     switch (size) {
//       case 'small': return 'loader-small';
//       case 'large': return 'loader-large';
//       default: return 'loader-medium';
//     }
//   };

//   const getTextClass = () => {
//     switch (size) {
//       case 'small': return 'loader-text-small';
//       case 'large': return 'loader-text-large';
//       default: return 'loader-text-medium';
//     }
//   };

//   return (
//     <div className="loader-container">
//       <div className={`loader ${getLoaderClass()}`}>
//         {/* ♻ Recycle Icon */}
//         <svg
//           className="loader-icon"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//         >
//           <path d="M16.9 6.3a1 1 0 0 0-1.7-1l-3 5a1 1 0 0 0 .9 1.5h6a1 1 0 0 0 .8-1.6l-3-4.9zM8 13H2.1a1 1 0 0 0-.9 1.5l3 5a1 1 0 0 0 1.7-1l-3-5H8a1 1 0 1 0 0-2zM21.8 13H16a1 1 0 0 0-.9 1.5l3 5a1 1 0 0 0 1.7-1l-3-5h4.9a1 1 0 0 0 0-2z"/>
//         </svg>
//       </div>
//       <p className={`loader-text ${getTextClass()}`}>{text}</p>
//     </div>
//   );
// };

// // ✅ Full screen loader overlay
// export const LoaderOverlay = ({ text = 'Loading' }) => {
//   return (
//     <div className="loader-overlay">
//       <Loader size="large" text={text} />
//     </div>
//   );
// };

// // ✅ Page loader (section centered)
// export const PageLoader = ({ text = 'Loading' }) => {
//   return (
//     <div className="page-loader">
//       <Loader size="large" text={text} />
//     </div>
//   );
// };

// export default Loader;
