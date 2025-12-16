import * as React from 'react';

const BitcoinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.135 7.422C16.53 6.33 15.358 5.5 14 5.5h-4.5a2.5 2.5 0 0 0-2.5 2.5v8a2.5 2.5 0 0 0 2.5 2.5H14c1.358 0 2.53-.83 3.135-1.922.38-.69.665-1.484.665-2.328s-.285-1.638-.665-2.328zM10 8.5h3.5a1.5 1.5 0 0 1 0 3H10v-3zm3.5 9H10v-3h3.5a1.5 1.5 0 0 1 0 3z" />
    <path d="M14.5 4.5h-5V3h5v1.5zM14.5 21h-5v-1.5h5V21z" />
  </svg>
);
export default BitcoinIcon;
